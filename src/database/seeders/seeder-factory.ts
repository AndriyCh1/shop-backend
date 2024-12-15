import { DataSource, EntityTarget, Repository } from 'typeorm';

import { SeederInterface } from './seeder.interface';

interface SeederOptions<T> {
  resetSequence?: boolean;
  dataSource: DataSource;
  entity: EntityTarget<T>;
}

class Seeder<T> implements SeederInterface<T> {
  private shouldResetSequence: boolean;
  private dataSource: DataSource;
  private entity: EntityTarget<T>;

  constructor({ resetSequence = false, dataSource, entity }: SeederOptions<T>) {
    this.shouldResetSequence = resetSequence;
    this.dataSource = dataSource;
    this.entity = entity;
  }

  async seed(data: T[]): Promise<void> {
    const repository: Repository<T> = this.dataSource.getRepository(
      this.entity,
    );

    if (this.shouldResetSequence) {
      await this.resetSequence();
    }

    await repository.save(data);
  }

  private async resetSequence(): Promise<void> {
    await this.dataSource.query(
      `ALTER SEQUENCE ${
        this.dataSource.getMetadata(this.entity).tableName
      }_id_seq RESTART;`,
    );
  }
}

export interface SeederFactoryOptions {
  resetSequence?: boolean;
  dataSource: DataSource;
}

export class SeederFactory {
  private resetSequence: boolean;
  private dataSource: DataSource;

  constructor({ resetSequence = false, dataSource }: SeederFactoryOptions) {
    this.resetSequence = resetSequence;
    this.dataSource = dataSource;
  }

  createSeeder<T>(entity: EntityTarget<T>): Seeder<T> {
    const seeder = new Seeder({
      resetSequence: this.resetSequence,
      dataSource: this.dataSource,
      entity,
    });

    return seeder;
  }
}
