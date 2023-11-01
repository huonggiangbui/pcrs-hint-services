import { Body, Controller, Logger, Param, Post } from '@nestjs/common';
import { CreateLogRecordDto } from 'src/dto/logging';
import { Logger as CustomLogEntity } from 'src/entity/logger.entity';
import { HintService } from 'src/service/hint.service';
import { LoggingService } from 'src/service/logging.service';
import { StudentService } from 'src/service/student.service';

@Controller()
export class LoggingController {
  constructor(
    private readonly hintService: HintService,
    private readonly studentService: StudentService,
    private readonly loggingService: LoggingService,
  ) {}

  @Post('logging/:id')
  async logActivity(
    @Param('id') id: number,
    @Body() body: CreateLogRecordDto,
  ): Promise<CustomLogEntity> {
    const hint = await this.hintService.findById(id);
    const student = await this.studentService.filterStudent(
      await hint.students,
      body.uid,
    );
    if (!student || !hint) {
      Logger.error(
        `Student with id ${body.uid} or hint with id ${id} not found`,
      );
      return null;
    }

    const logger = await this.loggingService.create(
      body.submission,
      hint,
      student,
    );
    delete logger['__hint__'];
    return logger;
  }
}
