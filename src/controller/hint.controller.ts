import { Body, Controller, Query, Get, Param, Post } from '@nestjs/common';
import { GetHintDto } from 'src/dto/get-hint';
import { Logger } from 'src/entity/logger.entity';
import { HintService } from 'src/service/hint.service';
import { LoggingService } from 'src/service/logging.service';
import { OpenAiService } from 'src/service/openai.service';
import { ProblemService } from 'src/service/problem.service';
import { StudentService } from 'src/service/student.service';
import { ActionType, ConditionType, LanguageType } from 'src/types';

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
    @Query() query: { uid: string },
  ): Promise<{
    condition: ConditionType;
    btnText: string;
  }> {
    const problem = await this.problemService.findByPk(
      params.pk,
      params.language,
    );
    let student;
    const students = (await problem.students).filter(
      (s) => s.uid === query.uid,
    );

    if (!students || students.length === 0) {
      const { condition, btnText } =
        await this.studentService.handleExperiment();
      student = await this.studentService.create(problem, {
        uid: query.uid,
        condition,
        btnText,
      });
    } else {
      student = students[0];
    }

    return { condition: student.condition, btnText: student.btnText };
  }

  @Post('hints/:language/:pk')
  async getHint(
    @Param() params: { language: LanguageType; pk: string },
    @Body() body: GetHintDto,
  ): Promise<unknown> {
    const problem = await this.problemService.findByPk(
      params.pk,
      params.language,
    );
    const student = (await problem.students).filter(
      (s) => s.uid === body.uid,
    )[0];

    const context = `${problem.language} problem: ${problem.name}\n\n${
      problem.description
    }\n\n${
      problem.starter_code
        ? 'Starter code:\n' + problem.starter_code + '\n\n'
        : ''
    }'${problem.solution ? 'Solution:\n' + problem.solution + '\n\n' : ''}`;

    const { hint, prompt, type } = await this.hintService.generateHint(
      OpenAiService.getInstance().openai,
      problem.language,
      context,
      body.submission,
      body.prevHint,
    );

    const config = await this.hintService.experimentUIConfig(type);

    return await this.hintService.create({
      student,
      problem,
      prompt,
      hint,
      type,
      submission: body.submission,
      config,
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
    @Body() body: { action: ActionType },
  ): Promise<Logger> {
    const hint = await this.hintService.findById(id);
    return await this.loggingService.create(
      body.action,
      await hint.student,
      hint,
    );
  }
}
