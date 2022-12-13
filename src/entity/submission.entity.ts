import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToOne } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { IHint, IProblem, IStudent, ISubmission } from '../types';
import { Problem } from './problem.entity';
import { Student } from './student.entity';
import { Hint } from './hint.entity';

@Entity()
@ObjectType()
export class Submission implements ISubmission {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: string;

  @ManyToOne(() => Problem, (p) => p.submissions)
  problem: IProblem;

  @ManyToOne(() => Student)
  student: IStudent;

  @OneToOne(() => Hint, (h) => h.submission)
  hint: IHint;
}
