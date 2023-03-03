import {
  Entity,
  Column,
  OneToMany,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ConditionType, IStudent } from '../types';
import { Hint } from './hint.entity';
import { Problem } from './problem.entity';
import { Logger } from './logger.entity';
import { Feedback } from './feedback.entity';

@Entity()
export class Student implements IStudent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uid: string;

  @Column({
    type: 'enum',
    enum: ConditionType,
    default: ConditionType.CONTROL,
  })
  condition: ConditionType;

  @Column({ nullable: true })
  btnText?: string;

  @Column({ nullable: true })
  btnColor?: string;

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
