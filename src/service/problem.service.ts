import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
    if (problem) await problem.students;
    return problem;
  }

  async create(
    language: LanguageType,
    pk: string,
    data: UpdateProblemDto,
  ): Promise<Problem> {
    const cleanedData = this.convertBooleanType(null, data);
    const problem = this.problemRepository.create({
      ...cleanedData,
      pk: pk,
      language: language,
    });

    await this.problemRepository.save(problem);

    return problem;
  }

  async updateProblem(
    language: LanguageType,
    pk: string,
    data: UpdateProblemDto,
  ): Promise<UpdateResult | Problem> {
    let problem = await this.findByPk(pk, language);
    if (!problem) {
      problem = await this.create(language, pk, data);
      return problem;
    }
    const cleanData = this.convertBooleanType(problem, data);
    return await this.problemRepository.update(problem.id, cleanData);
  }

  async delete(problem: Problem): Promise<Problem> {
    return await this.problemRepository.remove(problem);
  }

  convertBooleanType(
    problem: Problem,
    data: UpdateProblemDto,
  ): {
    typeExperiment: boolean;
    crossover: boolean;
    name?: string;
    description?: string;
    solution?: string;
    starter_code?: string;
  } {
    const { typeExperiment, crossover, ...rest } = data;
    let type = problem ? problem.typeExperiment : null;
    if (typeExperiment) type = typeExperiment === 'true';
    let cross = problem ? problem.crossover : null;
    if (crossover) cross = crossover === 'true';
    return { ...rest, typeExperiment: type, crossover: cross };
  }
}
