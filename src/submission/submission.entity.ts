import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToOne,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { IHint, IProblem, IStudent, ISubmission } from 'src/types';
import { Problem } from 'src/problem/problem.entity';
import { Student } from 'src/student/student.entity';
import { Hint } from 'src/hint/hint.entity';
// import { Metadata } from '../utils/metadata.type';

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
