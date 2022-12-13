import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { IProblem, ISubmission } from 'src/types';
import { Submission } from 'src/submission/submission.entity';
// import { Metadata } from '../utils/metadata.type';

@Entity()
@ObjectType()
export class Problem implements IProblem {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  solution?: string;

  @Column()
  starter_code?: string;

  @OneToMany(() => Submission, (s) => s.problem)
  submissions: ISubmission[];
}
