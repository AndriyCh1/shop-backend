import { OrderStatus } from '#database/entities/order-statuses.entity';

export const orderStatuses: Omit<OrderStatus, 'createdAt' | 'updatedAt'>[] = [
  { id: 1, statusName: 'Delivered', color: '#5ae510' },
  { id: 2, statusName: 'Unreached', color: '#ff03d3' },
  { id: 3, statusName: 'Paid', color: '#4caf50' },
  { id: 4, statusName: 'Confirmed', color: '#00d4cb' },
  { id: 5, statusName: 'Processing', color: '#ab5ae9' },
  { id: 6, statusName: 'Pending', color: '#ffe224' },
  { id: 7, statusName: 'On Hold', color: '#d6d6d6' },
  { id: 8, statusName: 'Shipped', color: '#71f9f7' },
  { id: 9, statusName: 'Cancelled', color: '#FD9F3D' },
  { id: 10, statusName: 'Refused', color: '#FF532F' },
  { id: 11, statusName: 'Awaiting Return', color: '#000' },
  { id: 12, statusName: 'Returned', color: '#000' },
];
