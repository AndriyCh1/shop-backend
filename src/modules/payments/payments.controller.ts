import {
  BadRequestException,
  Controller,
  Headers,
  Param,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';

import { PaymentsService } from '#modules/payments/services/payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-checkout-session/orders/:orderId')
  createOrderCheckoutSession(@Param('orderId') orderId: number) {
    return this.paymentsService.createOrderCheckoutSession(orderId);
  }

  @Post('webhook')
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    const event = await this.paymentsService.constructEventFromPayload(
      signature,
      req.rawBody,
    );

    await this.paymentsService.handleWebhook(event);
  }
}
