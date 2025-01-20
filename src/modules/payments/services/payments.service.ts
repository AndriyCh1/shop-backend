import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Stripe } from 'stripe';
import { Repository } from 'typeorm';

import {
  OrderStatus,
  OrderStatusEnum,
} from '#database/entities/order-statuses.entity';
import { Order } from '#database/entities/orders.entity';
import { OrderNotFoundException } from '#modules/payments/exceptions/order.exceptions';
import { CannotPayForOrderException } from '#modules/payments/exceptions/payment.exceptions';

const CURRENCY = 'usd'; // NOTE: In scale, we should store currency in database

@Injectable()
export class PaymentsService {
  private stripe: Stripe;
  private stripeWebhookSecret: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(OrderStatus)
    private readonly orderStatusRepository: Repository<OrderStatus>,
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2024-11-20.acacia',
    });
    this.stripeWebhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
  }

  async createOrderCheckoutSession(
    orderId: number,
  ): Promise<Stripe.Checkout.Session> {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
      relations: [
        'orderStatus',
        'orderItems',
        'orderItems.productVariant',
        'orderItems.productVariant.product',
        'orderItems.productVariant.product.productGallery',
      ],
    });

    if (!order) {
      throw new OrderNotFoundException(orderId);
    }

    if (
      order.orderStatus.statusName === OrderStatusEnum.CANCELLED ||
      order.orderStatus.statusName === OrderStatusEnum.PAID
    ) {
      throw new CannotPayForOrderException();
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      order.orderItems.map((item) => ({
        price_data: {
          currency: CURRENCY,
          product_data: {
            name: item.productVariant.name || item.productVariant.product.name,
            description:
              item.productVariant.shortDescription ||
              item.productVariant.product.shortDescription,
            images: [
              item.productVariant.product.productGallery.length > 0
                ? item.productVariant.product.productGallery[0].image
                : null,
            ],
          },
          unit_amount: Math.round(item.productVariant.salePrice * 100), // In cents
        },
        quantity: item.quantity,
      }));

    const session = await this.stripe.checkout.sessions.create({
      line_items: lineItems,
      metadata: { orderId: order.id },
      payment_intent_data: {
        metadata: { orderId: order.id },
      },
      mode: 'payment',
      success_url: `${this.configService.get(
        'FRONTEND_URL',
      )}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    });

    return session;
  }

  async handleWebhook(event: Stripe.Event): Promise<void> {
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      const orderId = Number(paymentIntent.metadata.orderId);

      const status = await this.orderStatusRepository.findOne({
        where: { statusName: OrderStatusEnum.PAID },
      });

      await this.ordersRepository.update(
        { id: orderId },
        { orderStatus: { id: status.id } },
      );
    }
  }

  public async constructEventFromPayload(signature: string, payload: Buffer) {
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      this.stripeWebhookSecret,
    );
  }
}
