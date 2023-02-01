import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hint } from 'src/entity/hint.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { DetailLevelType, HintType, LanguageType } from 'src/types';
import { Student } from 'src/entity/student.entity';
import { Problem } from 'src/entity/problem.entity';
import { UIConfig } from 'src/entity/Config';
import {
  HINT_DESCRIPTION,
  HINT_TITLE,
  MORE_HINT_PROMPT_HEADERS,
  PROMPT_HEADERS,
} from 'src/constants';
import { NullDeciderType, randomize } from 'src/utils/randomize';
import { OpenAIApi } from 'openai';

type CreateHintData = {
  student: Student;
  problem: Problem;
  prompt: string;
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
    hint.problem = Promise.resolve(problem);
    hint.student = Promise.resolve(student);
    await this.hintRepository.save(hint);
    return hint;
  }

  async generateHint(
    openai: OpenAIApi,
    language: LanguageType,
    context: string,
    submission: string,
    prevHint?: number,
  ): Promise<{
    hint: string;
    prompt: string;
    type: HintType;
  }> {
    let promptHeader;
    let prompt;

    if (!prevHint) {
      promptHeader = randomize(
        Object.entries(PROMPT_HEADERS),
        NullDeciderType.NO_NULL,
      );
      prompt = `${context}Student's code:\n\n${submission.slice(
        40,
        -41,
      )}\n\n## ${language}\n\n${promptHeader[0]}`;
    } else {
      const oldHint = this.findById(prevHint);
      promptHeader = randomize(
        Object.entries(MORE_HINT_PROMPT_HEADERS),
        NullDeciderType.NO_NULL,
      );
      prompt = `${context}${(await oldHint).prompt}${
        (await oldHint).hint
      }\n\n## ${language}\n\n${promptHeader[0]}`;
    }

    const response = await openai.createCompletion({
      model: 'code-davinci-002',
      prompt: prompt,
      temperature: 0,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop: ['Problem', 'Example', 'Solution', language],
    });

    return {
      hint: response.data.choices[0].text,
      prompt: promptHeader[0],
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
    const showTextFeedback = parseInt(feedback) < 3;
    return {
      message: 'Feedback received',
      showTextFeedback,
    };
  }
}
