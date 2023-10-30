import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProblemDto } from 'src/dto/create-problem';
import { UpdateProblemDto } from 'src/dto/update-problem';
import { Problem } from 'src/entity/problem.entity';
import { LanguageType } from '../types';
import { FindOneOptions, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class ProblemService {
  constructor(
    @InjectRepository(Problem)
    private problemRepository: Repository<Problem>,
  ) {}

  async findByPk(
    pk: string,
    language: LanguageType,
    options?: FindOneOptions<Problem>,
  ): Promise<Problem> {
    const problem = await this.problemRepository.findOne({
      where: { pk, language },
      ...options,
    });
    await problem.students;
    return problem;
  }

  async create(
    language: LanguageType,
    data: CreateProblemDto,
  ): Promise<Problem> {
    if (this.findByPk(data.pk, language)) {
      Logger.error(`Problem not found: ${data.pk}, language: ${language}`);
      return null;
    }

    const problem = this.problemRepository.create({
      ...data,
      language: language,
    });

    await this.problemRepository.save(problem);

    return problem;
  }

  async updateProblem(
    problem: Problem,
    data: UpdateProblemDto,
  ): Promise<UpdateResult> {
    return await this.problemRepository.update(problem.id, data);
  }

  async delete(problem: Problem): Promise<Problem> {
    return await this.problemRepository.remove(problem);
  }
}
