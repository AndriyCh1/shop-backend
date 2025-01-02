import { Paginated } from '#shared/interfaces/pagination.interface';

export interface PaginatePayload<T> {
  data: T;
  total: number;
  page: number;
  perPage: number;
  next?: string;
  prev?: string;
}

export class Paginate<T> implements Paginated<T> {
  public data: Paginated<T>['data'];
  public meta: Paginated<T>['meta'];

  constructor(payload: PaginatePayload<T>) {
    this.data = payload.data;
    this.meta = {
      total: payload.total,
      page: payload.page,
      perPage: payload.perPage,
      next: payload.next,
      prev: payload.prev,
    };
  }
}
