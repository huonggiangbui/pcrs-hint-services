import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hint } from 'src/entity/hint.entity';
import { Logger } from 'src/entity/logger.entity';
import { Student } from 'src/entity/student.entity';
import { ActionType } from '../types';
import { Repository } from 'typeorm';

@Injectable()
export class LoggingService {
  constructor(
    @InjectRepository(Logger)
    private loggingRepository: Repository<Logger>,
  ) {}

  async create(data: {
    action: ActionType;
    student: Student;
    submission: string;
    hint: Hint;
  }): Promise<Logger> {
    const logger = await this.loggingRepository.create({
      timestamp: new Date(),
      action: data.action,
      submission: data.submission,
    });
    logger.hint = Promise.resolve(data.hint);
    logger.student = Promise.resolve(data.student);
    await this.loggingRepository.save(logger);
    return logger;
  }
}
