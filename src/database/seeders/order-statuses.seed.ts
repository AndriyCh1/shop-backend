import {
  OrderStatus,
  OrderStatusEnum,
} from '#database/entities/order-statuses.entity';

export const orderStatuses: Omit<OrderStatus, 'createdAt' | 'updatedAt'>[] = [
  { id: 1, statusName: OrderStatusEnum.DELIVERED, color: '#5ae510' },
  { id: 2, statusName: OrderStatusEnum.UNREACHED, color: '#ff03d3' },
  { id: 3, statusName: OrderStatusEnum.PAID, color: '#4caf50' },
  { id: 4, statusName: OrderStatusEnum.CONFIRMED, color: '#00d4cb' },
  { id: 5, statusName: OrderStatusEnum.PROCESSING, color: '#ab5ae9' },
  { id: 6, statusName: OrderStatusEnum.PENDING, color: '#ffe224' },
  { id: 7, statusName: OrderStatusEnum.ON_HOLD, color: '#d6d6d6' },
  { id: 8, statusName: OrderStatusEnum.SHIPPED, color: '#71f9f7' },
  { id: 9, statusName: OrderStatusEnum.CANCELLED, color: '#FD9F3D' },
  { id: 10, statusName: OrderStatusEnum.REFUSED, color: '#FF532F' },
  { id: 11, statusName: OrderStatusEnum.AWAITING_RETURN, color: '#000' },
  { id: 12, statusName: OrderStatusEnum.RETURNED, color: '#000' },
];
