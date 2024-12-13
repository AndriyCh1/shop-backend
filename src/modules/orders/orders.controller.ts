import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateOrderDto } from '#modules/orders/dtos/requests/create-order.dto';
import { UpdateOrderStatusDto } from '#modules/orders/dtos/requests/update-order-status.dto';
import { OrdersService } from '#modules/orders/services/orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  createOrder(@Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(dto);
  }

  @Get()
  getOrders() {
    return this.ordersService.getOrders();
  }

  @Get(':id')
  getOrder(@Param('id') id: number) {
    return this.ordersService.getOrderWithFullDetails(id);
  }

  @Patch(':id/status')
  updateOrderStatus(
    @Param('id') id: number,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(id, dto.statusId);
  }

  @Delete(':id')
  deleteOrder(@Param('id') id: number) {
    return this.ordersService.deleteOrder(id);
  }

  @Patch(':id/cancel')
  cancelOrder(@Param('id') id: number) {
    return this.ordersService.cancelOrder(id);
  }
}
