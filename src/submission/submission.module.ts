import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hint } from 'src/hint/hint.entity';
import { Problem } from 'src/problem/problem.entity';
import { Student } from 'src/student/student.entity';
import { Submission } from './submission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Submission, Problem, Hint, Student])],
  providers: [],
  exports: [],
})
export class SubmissionModule {}
