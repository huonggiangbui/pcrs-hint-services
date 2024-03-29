import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hint } from 'src/entity/hint.entity';
import { Logger } from 'src/entity/logger.entity';
import { Student } from 'src/entity/student.entity';
import { ActionType } from 'src/types';
import { Repository } from 'typeorm';

@Injectable()
export class LoggingService {
  constructor(
    @InjectRepository(Logger)
    private loggingRepository: Repository<Logger>,
  ) {}

  async create(
    body: { submission: string; action: ActionType },
    hint: Hint,
    student: Student,
  ): Promise<Logger> {
    const logger = await this.loggingRepository.create({
      timestamp: new Date(),
      ...body,
    });
    logger.hint = Promise.resolve(hint);
    logger.student = Promise.resolve(student);
    await this.loggingRepository.save(logger);
    return logger;
  }
}
