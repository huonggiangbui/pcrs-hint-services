import {
  Body,
  Controller,
  Delete,
  Query,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateProblemDto } from 'src/dto/create-problem';
import { UpdateProblemDto } from 'src/dto/update-problem';
import { Problem } from 'src/entity/problem.entity';
import { ProblemService } from 'src/service/problem.service';
import { LanguageType } from '../types';

@Controller()
export class ProblemController {
  constructor(private readonly problemService: ProblemService) {}

  @Post('problems/:language')
  async createProblem(
    @Param('language') language: LanguageType,
    @Body() body: CreateProblemDto,
  ): Promise<Problem> {
    return this.problemService.create(language, body);
  }

  @Put('problems/:language/:pk')
  async updateProblem(
    @Param() params: { language: LanguageType; pk: string },
    @Body() body: UpdateProblemDto,
  ) {
    const { language, pk } = params;
    return this.problemService.update(language, pk, body);
  }

  @Delete('problems/:language/:pk')
  async deleteProblem(
    @Param() params: { language: LanguageType; pk: string },
  ): Promise<Problem> {
    const { language, pk } = params;
    const problem = await this.problemService.findByPk(pk, language);
    await this.problemService.delete(problem);
    return problem;
  }
}
