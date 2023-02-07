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

  /**
   * Returns a problem entity associated with the pk.
   * @param pk 
   * @param language 
   * @param options 
   * @returns A problem entity 
   */
  async findByPk(
    pk: string,
    language: LanguageType,
    options?: FindOneOptions<Problem>,
  ): Promise<Problem> {
    const problem = await this.problemRepository.findOneOrFail({
      where: { pk, language },
      ...options,
    });
    await problem.students;
    return problem;
  }

 
  /**
   * Creates a new problem entity and saves it to the repository.
   * @param language 
   * @param data 
   * @returns A new problem entity
   */
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

  /**
   * Updates an problem in the repository.
   * @param language 
   * @param pk 
   * @param data 
   * @returns 
   */
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

  /**
   * Deletes a problem in the repository.
   * @param language 
   * @param pk 
   * @returns 
   */
  async delete(language: LanguageType, pk: string): Promise<DeleteResult> {
    const problem = await this.findByPk(pk, language);
    return await this.problemRepository.delete(problem.id);
  }
}
