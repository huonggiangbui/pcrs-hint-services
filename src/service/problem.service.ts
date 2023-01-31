import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProblemDto } from 'src/dto/create-problem';
import { UpdateProblemDto } from 'src/dto/update-problem';
import { Problem } from 'src/entity/problem.entity';
import { LanguageType } from 'src/types';
import {
  DeleteResult,
  FindOneOptions,
  Repository,
  UpdateResult,
} from 'typeorm';

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
    return await this.problemRepository.findOneOrFail({
      where: { pk, language },
      ...options,
    });
  }

  async create(
    language: LanguageType,
    data: CreateProblemDto,
  ): Promise<Problem> {
    const { pk, name, description, starter_code, solution } = data;

    const problem = this.problemRepository.create({
      pk,
      language,
      name,
      description,
      starter_code,
      solution,
    });

    await this.problemRepository.save(problem);

    return problem;
  }

  async update(
    language: LanguageType,
    pk: string,
    data: UpdateProblemDto,
  ): Promise<UpdateResult> {
    const problem = await this.findByPk(pk, language);
    const { name, description, starter_code, solution } = data;
    return await this.problemRepository.update(problem.id, {
      name,
      description,
      starter_code,
      solution,
    });
  }

  async delete(language: LanguageType, pk: string): Promise<DeleteResult> {
    const problem = await this.findByPk(pk, language);
    return await this.problemRepository.delete(problem.id);
  }
}
