import { Body, Controller, Query, Get, Param, Post } from '@nestjs/common';
import { CreateLoggingData } from 'src/dto/logging';
import { Logger } from 'src/entity/logger.entity';
import { HintService } from 'src/service/hint.service';
import { LoggingService } from 'src/service/logging.service';
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

  @Post('hints/:language/:pk') // problem id
  async getHint(@Param() params, @Body() body): Promise<unknown> {
    const prompt = "What are the steps to improve the following sql code?\n" + body.submission.slice(40,-41);
    const student = await this.studentService.findByUid(body.uid);
    const problem = await this.problemService.findByPk(params.pk, params.language);

    return await this.hintService.create(prompt, student, problem);
    // return {
    //   id: 1,
    //   type: 'text',
    //   // hint: 'x = 4\ny = 5',
    //   hint: '\n1) Should we check if the number of followers is greater than or equal to 0 before checking if the number of followers is less than 10?\n\n- Yes, because if the number of followers is less than 0, then it does not make sense to compare it to 10.\n\n2) Should we check if the number of followers is greater than or equal to 10 before checking if the number of followers is less than 100?\n\n- Yes, because if the number of followers is less than 10, then it does not make sense to compare it to 100.\n\n3) Should we check if the number of followers is greater than or equal to 100 before printing ""expert""?\n\n- No, because if the number of followers is greater than or equal to 100, we can print ""expert"".',
    //   config: {
    //     // title: 'Hint',
    //     // description: 'This is your hint:',
    //     level: 2, // 1 means all content is shown at once, 2 means the detailed hints are hidden(on toggle)
    //     more: true,
    //     feedback: true,
    //   },
    // };
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
