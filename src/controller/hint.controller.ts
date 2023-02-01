import { Body, Controller, Query, Get, Param, Post } from '@nestjs/common';
import { GetHintDto } from 'src/dto/get-hint';
import { CreateLoggingData } from 'src/dto/logging';
import { Logger } from 'src/entity/logger.entity';
import { HintService } from 'src/service/hint.service';
import { LoggingService } from 'src/service/logging.service';
import { OpenAiService } from 'src/service/openai.service';
import { ProblemService } from 'src/service/problem.service';
import { StudentService } from 'src/service/student.service';
import { ConditionType, LanguageType } from 'src/types';

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
    btnText?: string;
  }> {
    let student = await this.studentService.findByUid(query.uid);
    if (!student) {
      const problem = await this.problemService.findByPk(
        params.pk,
        params.language,
      );
      const { condition, btnText } =
        await this.studentService.handleExperiment();
      student = await this.studentService.create({
        problem,
        uid: query.uid,
        condition,
        btnText,
      });
    }
    return { condition: student.condition, btnText: student.btnText };
  }

  @Post('hints/:language/:pk')
  async getHint(
    @Param() params: { language: LanguageType; pk: string },
    @Body() body: GetHintDto,
  ): Promise<unknown> {
    const student = await this.studentService.findByUid(body.uid);
    const problem = await this.problemService.findByPk(
      params.pk,
      params.language,
    );

    const { hint, type } = await this.hintService.generateHint(
      OpenAiService.getInstance().openai,
      body.submission,
    );

    const config = await this.hintService.experimentUIConfig(type);

    return await this.hintService.create({
      student,
      problem,
      hint,
      type,
      submission: body.submission,
      config,
    });
  }

  @Post('feedback/:language/:id')
  async sendFeedback(
    @Param('id') id: number,
    @Body() body: { feedback: string },
  ): Promise<{
    message: string;
    showTextFeedback?: boolean;
  }> {
    return await this.hintService.saveFeeback(id, body.feedback);
  }

  @Post('logging/:language/:id')
  async logActivity(
    @Param('id') id: number,
    @Body() body: CreateLoggingData,
  ): Promise<Logger> {
    const hint = await this.hintService.findById(id);
    const student = await this.studentService.findByUid(body.uid);
    return await this.loggingService.create(body.action, student, hint);
  }
}
