import { Body, Controller, Param, Post } from '@nestjs/common';
import { FeedbackService } from 'src/service/feedback.service';
import { HintService } from 'src/service/hint.service';
import { StudentService } from 'src/service/student.service';

@Controller()
export class FeedbackController {
  constructor(
    private readonly hintService: HintService,
    private readonly studentService: StudentService,
    private readonly feedbackService: FeedbackService,
  ) {}

  @Post('feedback/:id')
  async sendFeedback(
    @Param('id') id: number,
    @Body() body: { uid: string; feedback: string },
  ): Promise<{
    message: string;
  }> {
    const hint = await this.hintService.findById(id);
    const student = await this.studentService.findByUid(body.uid);

    if (!student || !hint) {
      return {
        message: `Student with id ${body.uid} or hint with id ${id} not found`,
      };
    }

    return await this.feedbackService.saveFeedback(
      hint,
      student,
      body.feedback,
    );
  }
}
