import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hint } from 'src/entity/hint.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { DetailLevelType, HintType } from '../types';
import { Student } from 'src/entity/student.entity';
import { Problem } from 'src/entity/problem.entity';
import { Config } from 'src/entity/Config';
import { Feedback } from 'src/entity/feedback.entity';

type CreateHintData = {
  problem: Problem;
  hint: string;
  type: HintType;
  level?: DetailLevelType;
};

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

  async create(data: CreateHintData): Promise<Hint> {
    const { problem, ...others } = data;
    const config = {} as Config;
    config.level = data.level;
    const hint = await this.hintRepository.create(others);
    hint.problem = Promise.resolve(problem);
    hint.config = config;
    await this.hintRepository.save(hint);
    return hint;
  }

  // async generateAutomaticHint(
  //   openai: OpenAIApi,
  //   language: LanguageType,
  //   context: string,
  //   submission: string,
  //   prevHint?: number,
  // ): Promise<{
  //   hintContent: string;
  //   prompt: string;
  //   type: HintType;
  // }> {
  //   let promptHeader;
  //   let prompt;

  //   if (!prevHint) {
  //     promptHeader = randomize(Object.entries(PROMPT_HEADERS));
  //     prompt = `${context}Student's code:\n\n${submission.slice(
  //       40,
  //       -41,
  //     )}\n\n## ${language}\n\n${promptHeader[0]}`;
  //   } else {
  //     const oldHint = this.findById(prevHint);
  //     promptHeader = randomize(Object.entries(MORE_HINT_PROMPT_HEADERS));
  //     prompt = `${context}${(await oldHint).prompt}${
  //       (await oldHint).hint
  //     }\n\n## ${language}\n\n${promptHeader[0]}`;
  //   }

  //   const response = await openai.createCompletion({
  //     model: 'code-davinci-002',
  //     prompt: prompt,
  //     temperature: 0,
  //     max_tokens: 256,
  //     top_p: 1,
  //     frequency_penalty: 0,
  //     presence_penalty: 0,
  //     stop: ['Problem', 'Example', 'Solution', language],
  //   });

  //   return {
  //     hintContent: response.data.choices[0].text,
  //     prompt: promptHeader[0],
  //     type: promptHeader[1],
  //   };
  // }

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
