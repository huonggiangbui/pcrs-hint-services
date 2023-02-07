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
import { ProblemService } from './service/problem.service';
import { StudentService } from './service/student.service';
import { LoggingService } from './service/logging.service';
import { OpenAiService } from './service/openai.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: '.env',
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV === 'development',
      logging: true,
      ssl: process.env.DB_SSL === 'true' && { rejectUnauthorized: false },
    }),
    TypeOrmModule.forFeature([Hint, Problem, Student, Logger]),
  ],
  providers: [
    AppService,
    ProblemService,
    HintService,
    StudentService,
    LoggingService,
    OpenAiService,
  ],
  controllers: [AppController, HintController, ProblemController],
})
export class AppModule {}
