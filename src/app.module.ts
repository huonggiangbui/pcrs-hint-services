import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configuration } from './config/configuration';
import { HintController } from './controller/hint.controller';
import { HintService } from './service/hint.service';
import { ProblemController } from './controller/problem.controller';
import { Hint } from './entity/hint.entity';
import { Problem } from './entity/problem.entity';
import { Student } from './entity/student.entity';
import { Logger } from './entity/logger.entity';

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
      synchronize: true,
      logging: true,
      ssl: process.env.DB_SSL === 'true' && { rejectUnauthorized: false },
    }),
    TypeOrmModule.forFeature([Hint, Problem, Student, Logger]),
  ],
  providers: [HintService],
  controllers: [HintController, ProblemController],
})
export class AppModule {}
