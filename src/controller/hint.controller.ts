import {
  Body,
  Controller,
  Query,
  Get,
  Param,
  Post,
  Delete,
  Logger,
  Put,
} from '@nestjs/common';
import { Hint } from 'src/entity/hint.entity';
import { Student } from 'src/entity/student.entity';
import { HintService } from 'src/service/hint.service';
import { ProblemService } from 'src/service/problem.service';
import { StudentService } from 'src/service/student.service';
import { LanguageType } from '../types';
import { randomize } from 'src/utils/randomize';
import { HintDto } from 'src/dto/hint';
import { UpdateResult } from 'typeorm';

@Controller()
export class HintController {
  constructor(
    private readonly hintService: HintService,
    private readonly problemService: ProblemService,
    private readonly studentService: StudentService,
  ) {}

  @Post('hints/:language/:pk')
  async postHint(
    @Param() params: { language: LanguageType; pk: string },
    @Body() body: HintDto,
  ): Promise<Hint> {
    const problem = await this.problemService.findByPk(
      params.pk,
      params.language,
    );
    if (!this.problemService.findByPk(params.pk, params.language)) {
      Logger.error(
        `Problem not found: ${params.pk}, language: ${params.language}`,
      );
      return null;
    }

    if (!body.hint || !body.type) {
      Logger.error(
        `Hint or type not found: ${body.hint}, ${body.type}. Cannot create a hint.`,
      );
      return null;
    }

    return await this.hintService.create(problem, body);
  }

  @Put('hints/:id')
  async updateHint(
    @Param('id') id: number,
    @Body() body: HintDto,
  ): Promise<UpdateResult> {
    const hint = await this.hintService.findById(id);
    if (!hint) {
      Logger.error(`Hint not found: ${id}`);
      return null;
    }
    return await this.hintService.update(id, body);
  }

  @Delete('hints/:id')
  async deleteHint(@Param('id') id: number): Promise<Hint> {
    const hint = await this.hintService.findById(id);
    if (!hint) {
      Logger.error(`Hint not found: ${id}`);
      return null;
    }
    return await this.hintService.delete(hint);
  }

  @Delete('hints/:language/:pk')
  async deleteAllHintsProblem(
    @Param() params: { language: LanguageType; pk: string },
  ): Promise<void> {
    const problem = await this.problemService.findByPk(
      params.pk,
      params.language,
    );
    const hints = await problem.hints;
    return await this.hintService.deleteAll(hints);
  }

  @Get('hints/:language/:pk')
  async getHint(
    @Param() params: { language: LanguageType; pk: string },
    @Query()
    query: {
      uid: string;
      currentHint?: string;
    },
  ): Promise<Hint> {
    const problem = await this.problemService.findByPk(
      params.pk,
      params.language,
    );

    if (!problem) {
      Logger.error(
        `Problem not found: ${params.pk}, language: ${params.language}`,
      );
      return null;
    }

    const { uid, currentHint } = query;
    const student = await this.studentService.filterStudent(
      await problem.students,
      uid,
    );

    if (!student || student.condition.visibility === 'control') {
      Logger.error(
        `Student not found: ${uid} or student is in control group. Cannot get hint.`,
      );
      return null;
    }

    if (currentHint) {
      const hint = await this.hintService.findById(parseInt(currentHint, 10));
      if (hint.next) {
        return await this.hintService.findById(hint.next);
      }
    }

    let hints = await this.hintService.findHeadHints(problem);

    if (problem.typeExperiment) {
      if (problem.crossover) {
        hints = hints.filter((hint) => hint.type !== student.condition.type);
      } else {
        hints = hints.filter((hint) => hint.type === student.condition.type);
      }
    }

    if (hints.length === 0) {
      Logger.error(
        `No hint exist for problem: pk ${params.pk}, language: ${params.language}`,
      );
      return null;
    }

    const hint = randomize(hints);
    await this.hintService.updateStudentOfHint(hint, student);

    delete hint['__students__'];
    hint.feedback = (await hint.feedback).filter(
      async (feedback) => (await feedback).student === student,
    );

    return hint;
  }

  @Get('config/:language/:pk')
  async getConfig(
    @Param() params: { language: LanguageType; pk: string },
    @Query() query: { uid: string },
  ): Promise<Student> {
    const { uid } = query;
    const { language, pk } = params;
    const problem = await this.problemService.findByPk(pk, language);
    if (!problem) {
      Logger.error(`Problem not found: ${pk}, language: ${language}`);
      return null;
    }
    const students = (await problem.students).filter((s) => s.uid === uid);
    let student: Student;

    if (students && students.length > 0) {
      student = students[0];
    } else {
      const condition = await this.studentService.handleExperiment();
      student = await this.studentService.findOne({
        uid,
        condition,
      });
      if (!student) {
        student = await this.studentService.create({
          uid,
          condition,
        });
      }
      await this.studentService.updateProblemOfStudent(student, problem);
    }

    return student;
  }
}
