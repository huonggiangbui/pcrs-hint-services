import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hint } from 'src/entity/hint.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { Configuration, OpenAIApi } from 'openai';
import { HintType, LanguageType } from 'src/types';
import { StudentService } from './student.service';
import { Student } from 'src/entity/student.entity';
import { Problem } from 'src/entity/problem.entity';


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

  async create(
    prompt: string,
    student: Student,
    problem: Problem
    ): Promise<Hint> {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    
    const response = await openai.createCompletion({
      model: "code-davinci-002",
      prompt: prompt,
      temperature: 0,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });


    const hint = await this.hintRepository.create({
      hint: response.data.choices[0].text,
      student: student,
      type: HintType.TEXT,
      problem: problem
    })
    return hint;
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
