import {
  Body,
  Controller,
  Query,
  Get,
  Param,
  Post,
  Delete,
} from '@nestjs/common';
import { Hint } from 'src/entity/hint.entity';
import { Student } from 'src/entity/student.entity';
import { Logger } from 'src/entity/logger.entity';
import { HintService } from 'src/service/hint.service';
import { LoggingService } from 'src/service/logging.service';
import { ProblemService } from 'src/service/problem.service';
import { StudentService } from 'src/service/student.service';
import { DetailLevelType, HintType, LanguageType } from '../types';
import { CreateLogRecordDto } from 'src/dto/logging';
import { randomize } from 'src/utils/randomize';

enum Hook {
  ON_SETUP = 'on-setup',
  ON_SUBMIT = 'on-submit',
}

@Controller()
export class HintController {
  constructor(
    private readonly hintService: HintService,
    private readonly problemService: ProblemService,
    private readonly studentService: StudentService,
    private readonly loggingService: LoggingService,
  ) {}

  @Post('hints/:language/:pk')
  async postHint(
    @Param() params: { language: LanguageType; pk: string },
    @Body()
    body: {
      hint: string;
      type: HintType;
      level?: DetailLevelType;
      more?: boolean;
    },
  ): Promise<Hint> {
    const problem = await this.problemService.findByPk(
      params.pk,
      params.language,
    );
    return await this.hintService.create({
      ...body,
      problem,
    });
  }

  @Get('config/:language/:pk')
  async getConfig(
    @Param() params: { language: LanguageType; pk: string },
    @Query() query: { uid: string; hook: Hook },
  ): Promise<Student> {
    const { uid, hook } = query;
    const problem = await this.problemService.findByPk(
      params.pk,
      params.language,
    );
    let student;
    const students = (await problem.students).filter((s) => s.uid === uid);

    if (students && students.length > 0) {
      student = students[0];
    } else {
      const condition = await this.studentService.handleExperiment();
      student = await this.studentService.findOne({
        uid,
        condition,
      });
      if (!student) {
        student = await this.studentService.create({
          uid,
          condition,
        });
      }
      await this.studentService.updateProblemOfStudent(student, problem);
    }

    return student;
  }

  @Get('hints/:language/:pk')
  async getHint(
    @Param() params: { language: LanguageType; pk: string },
    @Query()
    query: {
      submission: string;
      uid: string;
      prevHint?: number;
    },
  ): Promise<Hint> {
    const { submission, uid, prevHint } = query;
    const problem = await this.problemService.findByPk(
      params.pk,
      params.language,
    );

    const hints = await problem.hints;

    if (hints.length > 0) {
      return null;
    }
    const hint = randomize(hints);

    const student = await this.studentService.filterStudent(
      await problem.students,
      uid,
    );
    await this.hintService.updateStudentOfHint(hint, student);

    delete hint['__students__'];
    hint.feedback = (await hint.feedback).filter(
      async (feedback) => (await feedback).student === student,
    );

    return hint;
  }

  @Delete('hints/:language/:pk')
  async deleteAllHintsProblem(
    @Param() params: { language: LanguageType; pk: string },
  ): Promise<void> {
    const problem = await this.problemService.findByPk(
      params.pk,
      params.language,
    );
    const hints = await problem.hints;
    return await this.hintService.deleteAll(hints);
  }

  @Post('feedback/:id')
  async sendFeedback(
    @Param('id') id: number,
    @Body() body: { uid: string; feedback: string },
  ): Promise<{
    message: string;
    showTextFeedback?: boolean;
  }> {
    const hint = await this.hintService.findById(id);
    const student = await this.studentService.filterStudent(
      await hint.students,
      body.uid,
    );
    return await this.hintService.saveFeedback(hint, student, body.feedback);
  }

  @Post('logging/:id')
  async logActivity(
    @Param('id') id: number,
    @Body() body: CreateLogRecordDto,
  ): Promise<Logger> {
    const hint = await this.hintService.findById(id);
    const student = await this.studentService.filterStudent(
      await hint.students,
      body.uid,
    );
    const logger = await this.loggingService.create({
      action: body.action,
      submission: body.submission,
      student,
      hint,
    });
    delete logger['__hint__'];
    return logger;
  }
}
