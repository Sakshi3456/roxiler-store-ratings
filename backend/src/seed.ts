import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { User, UserRole } from './users/user.entity';
import { Store } from './stores/store.entity';
import { Rating } from './ratings/rating.entity';

dotenv.config();

// Run with: npm run seed
// Creates one admin account so you have a way to log in for the first time.
async function run() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User, Store, Rating],
    synchronize: true,
  });

  await dataSource.initialize();
  const usersRepo = dataSource.getRepository(User);

  const email = process.env.SEED_ADMIN_EMAIL;
  const existing = await usersRepo.findOne({ where: { email } });
  if (existing) {
    console.log(`Admin account already exists for ${email}`);
  } else {
    const hashed = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD, 10);
    const admin = usersRepo.create({
      name: process.env.SEED_ADMIN_NAME,
      email,
      address: process.env.SEED_ADMIN_ADDRESS,
      password: hashed,
      role: UserRole.ADMIN,
    });
    await usersRepo.save(admin);
    console.log(`Created admin account: ${email} / ${process.env.SEED_ADMIN_PASSWORD}`);
  }

  await dataSource.destroy();
}

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
