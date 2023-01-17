import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configuration } from './config/configuration';
import { HintController } from './controller/hint.controller';
import { HintService } from './service/hint.service';
import { ProblemController } from './controller/problem.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
      ssl: process.env.DB_SSL === 'true' && { rejectUnauthorized: false },
    }),
  ],
  providers: [HintService],
  controllers: [HintController, ProblemController],
})
export class AppModule {}
