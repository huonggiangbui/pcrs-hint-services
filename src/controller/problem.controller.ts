import {
  Body,
  Controller,
  Delete,
  Query,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Problem } from 'src/entity/problem.entity';
import { ProblemService } from 'src/service/problem.service';

@Controller()
export class ProblemController {
  constructor(private readonly problemService: ProblemService) { }

  @Post('problems/:language')
  async createProblem(@Param() params, @Body() body): Promise<Problem> {
    // throw new Error();
    // NOTE: need name, description, starter_code, solution in body
    return this.problemService.createProblem(params, body)
  }

  @Put('problems/:language/:id')
  async updateProblem(@Param() params, @Body() body): Promise<unknown> {
    // NOTE: field to be updated in body
    console.log(body);
    return {};
  }

  @Delete('problems/:language/:id')
  async deleteProblem(@Param() params, @Query() query): Promise<unknown> {
    console.log(query);
    return {};
  }
}
