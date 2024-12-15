export interface SeederInterface<T> {
  seed(data: T[]): Promise<void>;
}
