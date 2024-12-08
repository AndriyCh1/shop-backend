import { dataSource } from '#database/data-source';
import { Country } from '#database/entities/countries.entity';
import { OrderStatus } from '#database/entities/order-statuses.entity';
import { countries } from '#database/seeders/countries.seed';
import { orderStatuses } from '#database/seeders/order-statuses.seed';
import { SeederFactory } from '#database/seeders/seeder-factory';

const runSeeders = async () => {
  const initializedDataSource = await dataSource.initialize();

  const seederFactory = new SeederFactory({
    dataSource: initializedDataSource,
    resetSequence: true,
  });

  const countriesSeeder = seederFactory.createSeeder(Country);
  const orderStatusSeeder = seederFactory.createSeeder(OrderStatus);

  try {
    await countriesSeeder.seed(countries);
    await orderStatusSeeder.seed(orderStatuses as OrderStatus[]);
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await initializedDataSource.destroy();
  }
};

runSeeders();
