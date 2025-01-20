export interface Paginated<T> {
  data: T[];
  meta: {
    total: number; // NOTE: Total number of items (not number of pages)
    page: number;
    perPage: number;
    next?: string;
    prev?: string;
  };
}

export interface PaginationOptions {
  page: number;
  perPage: number;
}
