import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OrderItem } from '#database/entities/order-items.entity';
import {
  OrderStatus,
  OrderStatusEnum,
} from '#database/entities/order-statuses.entity';
import { Order } from '#database/entities/orders.entity';
import { ProductVariant } from '#database/entities/product-variants.entity';
import { UserAddress } from '#database/entities/user-addresses.entity';
import {
  NotEnoughStockException,
  OrderNotFoundException,
  ProductVariantNotFoundException,
} from '#modules/orders/exceptions/order.exception';
import { CreateOrderData } from '#modules/orders/interfaces/order.interface';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(ProductVariant)
    private readonly productVariantRepository: Repository<ProductVariant>,
    @InjectRepository(UserAddress)
    private readonly userAddressRepository: Repository<UserAddress>,
    @InjectRepository(OrderStatus)
    private readonly orderStatusRepository: Repository<OrderStatus>,
  ) {}

  async createOrder(payload: CreateOrderData): Promise<Order> {
    const { userId, items } = payload;

    const orderItems: OrderItem[] = [];
    let totalPrice = 0;

    for (const item of items) {
      const productVariant = await this.productVariantRepository.findOne({
        where: { id: item.productVariantId },
        relations: ['product'],
      });

      if (!productVariant) {
        throw new ProductVariantNotFoundException(item.productVariantId);
      }

      if (productVariant.stockQuantity < item.quantity) {
        throw new NotEnoughStockException(
          productVariant.id,
          productVariant.stockQuantity,
        );
      }

      const orderItemInstance = this.orderItemsRepository.create({
        productVariant,
        quantity: item.quantity,
        price: productVariant.salePrice,
        total: productVariant.salePrice * item.quantity,
        productName: productVariant.product.name,
        productVariantName: productVariant.name,
        productVariantSku: productVariant.sku,
      });

      const savedOrderItem = await this.orderItemsRepository.save(
        orderItemInstance,
      );

      orderItems.push(savedOrderItem);
      totalPrice += savedOrderItem.total;
    }

    if (payload.shippingAddress) {
      await this.userAddressRepository.save(
        this.userAddressRepository.create({
          user: { id: userId },
          ...payload.shippingAddress,
        }),
      );
    }

    const orderStatus = await this.orderStatusRepository.findOne({
      where: { statusName: OrderStatusEnum.PENDING },
    });

    const order = this.ordersRepository.create({
      user: { id: userId },
      total: totalPrice,
      orderItems,
      orderStatus,
      customerFirstName: payload.contactInfo.firstName,
      customerLastName: payload.contactInfo.lastName,
      phoneNumber: payload.contactInfo.phoneNumber,
      email: payload.contactInfo.email,
      addressLine1: payload.shippingAddress.addressLine1,
      addressLine2: payload.shippingAddress.addressLine2,
      country: payload.shippingAddress.country,
      city: payload.shippingAddress.city,
      state: payload.shippingAddress.state,
      postalCode: payload.shippingAddress.postalCode,
    });

    return this.ordersRepository.save(order);
  }

  async getOrders(): Promise<Order[]> {
    return this.ordersRepository.find({
      relations: ['user', 'orderItems', 'orderItems.productVariant'],
    });
  }

  async getOrder(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
    });

    if (!order) {
      throw new OrderNotFoundException(id);
    }

    return order;
  }

  async getOrderWithFullDetails(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: [
        'orderStatus',
        'orderItems',
        'orderItems.productVariant',
        'orderItems.productVariant.product',
        'orderItems.productVariant.product.productGallery',
      ],
    });

    if (!order) {
      throw new OrderNotFoundException(id);
    }

    return order;
  }

  async updateOrderStatus(id: number, statusId: number): Promise<Order> {
    const updateResult = await this.ordersRepository
      .createQueryBuilder('orders')
      .update()
      .set({ orderStatus: { id: statusId } })
      .where({ id })
      .returning('*')
      .execute();

    if (updateResult.affected === 0) {
      throw new OrderNotFoundException(id);
    }

    return updateResult.raw[0];
  }

  async deleteOrder(id: number): Promise<void> {
    const deletionResult = await this.ordersRepository.delete(id);

    if (deletionResult.affected === 0) {
      throw new OrderNotFoundException(id);
    }
  }

  async cancelOrder(id: number): Promise<void> {
    const order = await this.getOrderWithFullDetails(id);

    if (!order) {
      throw new OrderNotFoundException(id);
    }

    for (const item of order.orderItems) {
      await this.productVariantRepository.increment(
        { id: item.productVariant.id },
        'stockQuantity',
        item.quantity,
      );
    }

    const orderStatus = await this.orderStatusRepository.findOne({
      where: { statusName: OrderStatusEnum.CANCELLED },
    });

    await this.ordersRepository.update({ id }, { orderStatus });
  }
}
