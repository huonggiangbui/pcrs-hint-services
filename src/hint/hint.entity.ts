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
import { IHint, HintType, ISubmission } from 'src/types';
import { Submission } from 'src/submission/submission.entity';
// import { Metadata } from '../utils/metadata.type';

@Entity()
@ObjectType()
export class Hint implements IHint {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: string;

  @Column(() => String)
  type: HintType;

  @OneToOne(() => Submission, (s) => s.hint)
  submission: ISubmission;
}
