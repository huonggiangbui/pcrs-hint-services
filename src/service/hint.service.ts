import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hint } from 'src/entity/hint.entity';
import { FindOneOptions, Repository } from 'typeorm';
import {
  DetailLevelType,
  HintAuthorType,
  HintType,
  LanguageType,
} from '../types';
import { Student } from 'src/entity/student.entity';
import { Problem } from 'src/entity/problem.entity';
import { UIConfig } from 'src/entity/Config';
import {
  HINT_DESCRIPTION,
  HINT_TITLE,
  MORE_HINT_PROMPT_HEADERS,
  PROMPT_HEADERS,
} from 'src/constants';
import { randomize } from 'src/utils/randomize';
import { OpenAIApi } from 'openai';

type CreateHintData = {
  problem: Problem;
  prompt?: string;
  hint: string;
  type: HintType;
  level?: number;
  author: HintAuthorType;
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

  async findAllInstructorHints(problem: Problem): Promise<Hint[]> {
    return (await problem.hints).filter(
      (hint) => hint.author === HintAuthorType.INSTRUCTOR,
    );
  }

  async create(data: CreateHintData): Promise<Hint> {
    const { problem, type, author, ...others } = data;
    const config = await this.experimentUIConfig(type, author);
    if (author === HintAuthorType.INSTRUCTOR) {
      config.level = data.level;
    }
    const hint = await this.hintRepository.create({
      ...others,
      config,
    });
    hint.problem = Promise.resolve(problem);
    await this.hintRepository.save(hint);
    return hint;
  }

  async experimentUIConfig(
    type: HintType,
    author: HintAuthorType,
  ): Promise<UIConfig> {
    const title = randomize(HINT_TITLE);
    const description = randomize(HINT_DESCRIPTION);
    let level = null;
    let more = null;
    if (author !== HintAuthorType.INSTRUCTOR) {
      if (type === HintType.TEXT) {
        level = randomize([DetailLevelType.BOTTOM_OUT, DetailLevelType.HIDDEN]);
      }
      more = randomize([true, false]);
    }
    return { title, description, level, more };
  }

  async generateAutomaticHint(
    openai: OpenAIApi,
    language: LanguageType,
    context: string,
    submission: string,
    prevHint?: number,
  ): Promise<{
    hintContent: string;
    prompt: string;
    type: HintType;
  }> {
    let promptHeader;
    let prompt;

    if (!prevHint) {
      promptHeader = randomize(Object.entries(PROMPT_HEADERS));
      prompt = `${context}Student's code:\n\n${submission.slice(
        40,
        -41,
      )}\n\n## ${language}\n\n${promptHeader[0]}`;
    } else {
      const oldHint = this.findById(prevHint);
      promptHeader = randomize(Object.entries(MORE_HINT_PROMPT_HEADERS));
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
      hintContent: response.data.choices[0].text,
      prompt: promptHeader[0],
      type: promptHeader[1],
    };
  }

  async updateStudentOfHint(hint: Hint, student: Student): Promise<Hint> {
    hint.students = Promise.resolve([...(await hint.students), student]);
    await this.hintRepository.save(hint);
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
    hint.feedback = hint.feedback.concat(feedback, ',');
    await this.hintRepository.save(hint);
    const showTextFeedback = parseInt(feedback) < 3;
    return {
      message: 'Feedback received',
      showTextFeedback,
    };
  }
}
