import { Body, Controller, Query, Get, Param, Post } from '@nestjs/common';
import { Hint } from 'src/entity/hint.entity';
import { Student } from 'src/entity/student.entity';
import { Logger } from 'src/entity/logger.entity';
import { HintService } from 'src/service/hint.service';
import { LoggingService } from 'src/service/logging.service';
import { OpenAiService } from 'src/service/openai.service';
import { ProblemService } from 'src/service/problem.service';
import { StudentService } from 'src/service/student.service';
import { HintAuthorType, HintType, LanguageType } from '../types';
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

    if (!students || students.length === 0) {
      const config = await this.studentService.handleExperiment();
      student = await this.studentService.findOne({
        uid,
        ...config,
      });
      if (!student) {
        student = await this.studentService.create({
          uid,
          ...config,
        });
      }
      await this.studentService.updateProblemOfStudent(student, problem);
    } else {
      student = students[0];
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

    const student = (await problem.students).filter((s) => s.uid === uid)[0];

    const hints = await this.hintService.findAllInstructorHints(problem);

    let hint = null;
    if (hints.length > 0) {
      hint = randomize(hints);
    } else {
      const context = `${problem.language} problem: ${problem.name}\n\n${
        problem.description
      }\n\n${
        problem.starter_code
          ? 'Starter code:\n' + problem.starter_code + '\n\n'
          : ''
      }'${problem.solution ? 'Solution:\n' + problem.solution + '\n\n' : ''}`;

      const { hintContent, prompt, type } =
        await this.hintService.generateAutomaticHint(
          OpenAiService.getInstance().openai,
          problem.language,
          context,
          submission,
          prevHint,
        );

      hint = await this.hintService.create({
        problem,
        prompt,
        hint: hintContent,
        type,
        author: HintAuthorType.OPENAI,
      });
    }

    return await this.hintService.updateStudentOfHint(hint, student);
  }

  @Post('hints/:language/:pk')
  async postHint(
    @Param() params: { language: LanguageType; pk: string },
    @Body() body: { hint: string; type: HintType; level: number },
  ): Promise<Hint> {
    const problem = await this.problemService.findByPk(
      params.pk,
      params.language,
    );
    return await this.hintService.create({
      ...body,
      problem,
      author: HintAuthorType.INSTRUCTOR,
    });
  }

  @Post('feedback/:id')
  async sendFeedback(
    @Param('id') id: number,
    @Body() body: { feedback: string },
  ): Promise<{
    message: string;
    showTextFeedback?: boolean;
  }> {
    return await this.hintService.saveFeeback(id, body.feedback);
  }

  @Post('logging/:id')
  async logActivity(
    @Param('id') id: number,
    @Body() body: CreateLogRecordDto,
  ): Promise<Logger> {
    const hint = await this.hintService.findById(id);
    const student = (await hint.students).filter((s) => s.uid === body.uid)[0];
    return await this.loggingService.create({
      action: body.action,
      submission: body.submission,
      student,
      hint,
    });
  }
}
