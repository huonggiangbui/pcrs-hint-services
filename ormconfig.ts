import * as path from 'path';
import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

dotenvExpand.expand(dotenv.config());

export const ormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  autoLoadEntities: true,
  entities: [path.resolve(`${__dirname}/src/entity/*{.ts,.js}`)],
  synchronize: process.env.NODE_ENV === 'development',
  logging: true,
  ssl: process.env.DB_SSL === 'true' && { rejectUnauthorized: false },
  migrations: [path.resolve(`${__dirname}/src/migrations/*{.ts,.js}`)],
  keepConnectionAlive: true,
  migrationsRun: true,
};
