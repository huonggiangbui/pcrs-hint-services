import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { IHint, HintType, ISubmission } from '../types';
import { Submission } from './submission.entity';

@Entity()
@ObjectType()
export class Hint implements IHint {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: string;

  @Column({
    type: 'enum',
    enum: HintType,
    default: HintType.AUTOMATIC,
  })
  @Field()
  type: HintType;

  @OneToOne(() => Submission, (s) => s.hint)
  @JoinColumn()
  submission: ISubmission;
}
