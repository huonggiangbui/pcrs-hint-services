import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Feedback } from 'src/entity/feedback.entity';
import { Hint } from 'src/entity/hint.entity';
import { Student } from 'src/entity/student.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,
  ) {}

  async saveFeedback(
    hint: Hint,
    student: Student,
    feedback: string,
  ): Promise<{
    message: string;
  }> {
    let feedback_entity;
    const feedback_all = (await hint.feedback).filter(
      async (feedback) => (await feedback.student) === student,
    );

    if (feedback_all && feedback_all.length !== 0) {
      feedback_entity = feedback_all[0];
      feedback_entity.text_feedback = feedback;
    } else if (this.isNumericFeedback(feedback)) {
      feedback_entity = await this.feedbackRepository.create();
      feedback_entity.student = Promise.resolve(student);
      feedback_entity.hint = Promise.resolve(hint);
      feedback_entity.likert_feedback = parseInt(feedback);
    } else {
      throw new BadRequestException('Invalid feedback');
    }

    await this.feedbackRepository.save(feedback_entity);
    return { message: 'Feedback received' };
  }

  isNumericFeedback(feedback: string): boolean {
    const numeric = parseInt(feedback);
    if (isNaN(numeric)) return false;
    if (numeric < 1 || numeric > 5) return false;
    return true;
  }
}
