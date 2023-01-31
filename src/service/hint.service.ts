import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hint } from 'src/entity/hint.entity';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class HintService {
  constructor(
    @InjectRepository(Hint)
    private hintRepository: Repository<Hint>,
  ) {}

  async findById(id: number, options?: FindOneOptions<Hint>): Promise<Hint> {
    return await this.hintRepository.findOneOrFail({
      where: { id },
      ...options,
    });
  }

  async create(): Promise<Hint> {
    return;
  }

  async saveFeeback(
    id: number,
    feedback: string,
  ): Promise<{
    message: string;
    showTextFeedback?: boolean;
  }> {
    const hint = await this.findById(id);
    if (!hint.feedback) {
      hint.feedback = '';
    }
    hint.feedback = hint.feedback.concat(',', feedback);
    await this.hintRepository.save(hint);
    const textFeedbackDecider = Math.floor(Math.random() * 2);
    return {
      message: 'Feedback received',
      showTextFeedback: textFeedbackDecider === 1,
    };
  }
}
