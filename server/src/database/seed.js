import 'dotenv/config';
import sequelize from '../config/database.js';
import seedInitialData from './seeders/001-initial-data.js';

const seeders = [seedInitialData];

async function seed() {
  await sequelize.authenticate();

  for (const runSeeder of seeders) {
    await runSeeder();
  }

  console.log('Seed data completed. Change the default administrator password before production use.');
}

seed()
  .then(() => sequelize.close())
  .catch(async (error) => { console.error(error); await sequelize.close(); process.exitCode = 1; });
