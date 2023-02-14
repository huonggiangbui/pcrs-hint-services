import { ormConfig } from './ormconfig';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const PostgresDataSource = new DataSource(
  ormConfig as PostgresConnectionOptions,
);
