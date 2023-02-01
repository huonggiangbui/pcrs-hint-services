import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hint } from 'src/entity/hint.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { DetailLevelType, HintType } from 'src/types';
import { Student } from 'src/entity/student.entity';
import { Problem } from 'src/entity/problem.entity';
import { UIConfig } from 'src/entity/Config';
import { HINT_DESCRIPTION, HINT_TITLE, PROMPT_HEADERS } from 'src/constants';
import { NullDeciderType, randomize } from 'src/utils/randomize';
import { OpenAIApi } from 'openai';

type CreateHintData = {
  student: Student;
  problem: Problem;
  hint: string;
  type: HintType;
  config: UIConfig;
  submission: string;
};

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

  async create(data: CreateHintData): Promise<Hint> {
    const { problem, student, ...others } = data;
    const hint = await this.hintRepository.create(others);
    hint.problem = problem;
    hint.student = student;
    await this.hintRepository.save(hint);
    return hint;
  }

  async generateHint(
    openai: OpenAIApi,
    submission: string,
  ): Promise<{
    hint: string;
    type: HintType;
  }> {
    const promptHeader =
      Object.entries(PROMPT_HEADERS)[
        Math.floor(Math.random() * Object.keys(PROMPT_HEADERS).length)
      ];
    const prompt = promptHeader[0] + submission.slice(40, -41);

    const response = await openai.createCompletion({
      model: 'code-davinci-002',
      prompt: prompt,
      temperature: 0,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop: ['Problem', 'Example'],
    });

    return {
      hint: response.data.choices[0].text,
      type: promptHeader[1],
    };
  }

  async experimentUIConfig(type: HintType): Promise<UIConfig> {
    const title = randomize(HINT_TITLE, NullDeciderType.ALLOW_NULL);
    const description = randomize(HINT_DESCRIPTION, NullDeciderType.ALLOW_NULL);
    let level = null;
    if (type === 'text') {
      level = randomize(
        [DetailLevelType.BOTTOM_OUT, DetailLevelType.HIDDEN],
        NullDeciderType.NO_NULL,
      );
    }
    const more = randomize([true, false], NullDeciderType.NO_NULL);
    const feedback = randomize([true, false], NullDeciderType.NO_NULL);
    return { title, description, level, more, feedback };
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
    hint.feedback = hint.feedback.concat(feedback, ',');
    await this.hintRepository.save(hint);
    const showTextFeedback = randomize([true, false], NullDeciderType.NO_NULL);
    return {
      message: 'Feedback received',
      showTextFeedback,
    };
  }
}
