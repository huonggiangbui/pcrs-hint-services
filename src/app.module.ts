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
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ormConfig } from 'ormconfig';
import { Feedback } from './entity/feedback.entity';
import { LoggingController } from './controller/logging.controller';
import { FeedbackController } from './controller/feedback.controller';
import { FeedbackService } from './service/feedback.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: '.env',
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRoot(ormConfig),
    TypeOrmModule.forFeature([Hint, Problem, Student, Logger, Feedback]),
  ],
  providers: [
    AppService,
    ProblemService,
    HintService,
    StudentService,
    LoggingService,
    FeedbackService,
  ],
  controllers: [
    AppController,
    HintController,
    ProblemController,
    LoggingController,
    FeedbackController,
  ],
})
export class AppModule {}
