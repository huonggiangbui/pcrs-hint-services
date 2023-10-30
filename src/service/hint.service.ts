import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hint } from 'src/entity/hint.entity';
import { FindOneOptions, Repository, UpdateResult } from 'typeorm';
import { Student } from 'src/entity/student.entity';
import { Problem } from 'src/entity/problem.entity';
import { Feedback } from 'src/entity/feedback.entity';
import { HintDto } from 'src/dto/hint';

@Injectable()
export class HintService {
  constructor(
    @InjectRepository(Hint)
    private hintRepository: Repository<Hint>,
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,
  ) {}

  async findById(id: number, options?: FindOneOptions<Hint>): Promise<Hint> {
    return await this.hintRepository.findOneOrFail({
      where: { id },
      ...options,
    });
  }

  async findHeadHints(problem: Problem): Promise<Hint[]> {
    const hints = await problem.hints;
    return hints.filter((hint) => !hint.prev);
  }

  async create(problem: Problem, data: HintDto): Promise<Hint> {
    const hint = await this.hintRepository.create(data);
    hint.problem = Promise.resolve(problem);
    await this.hintRepository.save(hint);

    if (data.prev) {
      const prevHint = await this.findById(data.prev);
      prevHint.next = hint.id;
      await this.hintRepository.save(prevHint);
    }

    return hint;
  }

  async update(id: number, data: HintDto): Promise<UpdateResult> {
    return await this.hintRepository.update(id, data);
  }

  async delete(hint: Hint): Promise<Hint> {
    return await this.hintRepository.remove(hint);
  }

  async updateStudentOfHint(hint: Hint, student: Student): Promise<void> {
    hint.students = Promise.resolve([...(await hint.students), student]);
    await this.hintRepository.save(hint);
  }

  async deleteAll(hints: Hint[]): Promise<void> {
    await this.hintRepository.remove(hints);
  }

  async saveFeedback(
    hint: Hint,
    student: Student,
    feedback: string,
  ): Promise<{
    message: string;
    showTextFeedback?: boolean;
  }> {
    let feedback_entity;
    const feedback_all = (await hint.feedback).filter(
      async (feedback) => (await feedback.student) === student,
    );

    if (!feedback_all || feedback_all.length === 0) {
      if (!parseInt(feedback))
        throw new BadRequestException('Must submit numeric feedback first');
      feedback_entity = await this.feedbackRepository.create({
        likert_feedback: parseInt(feedback),
      });
      feedback_entity.student = Promise.resolve(student);
      feedback_entity.hint = Promise.resolve(hint);
    } else {
      feedback_entity = feedback_all[0];
      if (feedback_entity.text_feedback)
        throw new BadRequestException(
          'Can only submit feedback once, already submitted',
        );
      feedback_entity.text_feedback = feedback;
    }
    await this.feedbackRepository.save(feedback_entity);
    const showTextFeedback = parseInt(feedback) < 3;
    return {
      message: 'Feedback received',
      showTextFeedback,
    };
  }
}
