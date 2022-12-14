import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { IProblem, ISubmission } from 'src/types';
import { Submission } from './submission.entity';

@Entity()
@ObjectType()
export class Problem implements IProblem {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  description: string;

  @Column()
  solution?: string;

  @Column()
  starter_code?: string;

  @OneToMany(() => Submission, (s) => s.problem)
  submissions: ISubmission[];
}
