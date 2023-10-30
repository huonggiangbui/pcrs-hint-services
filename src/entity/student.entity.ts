import {
  Entity,
  Column,
  OneToMany,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IStudent } from '../types';
import { Hint } from './hint.entity';
import { Problem } from './problem.entity';
import { Logger } from './logger.entity';
import { Feedback } from './feedback.entity';
import { ConditionType } from './ConditionType';

@Entity()
export class Student implements IStudent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uid: string;

  @Column(() => ConditionType)
  condition: ConditionType;

  @ManyToMany(() => Hint, (h) => h.students, {
    cascade: true,
  })
  hints: Hint[];

  @ManyToMany(() => Problem, (p) => p.students, {
    cascade: true,
  })
  problems: Promise<Problem[]>;

  @OneToMany(() => Logger, (p) => p.student)
  logs: Promise<Logger[]>;

  @OneToMany(() => Feedback, (f) => f.student)
  feedback: Promise<Feedback[]>;
}
