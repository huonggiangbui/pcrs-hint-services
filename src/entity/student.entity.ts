import {
  Entity,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  PrimaryColumn,
} from 'typeorm';
import { ConditionType, IStudent } from '../types';
import { Hint } from './hint.entity';
import { Problem } from './problem.entity';
import { Logger } from './logger.entity';

@Entity()
export class Student implements IStudent {
  @PrimaryColumn()
  uid: string;

  @Column({
    type: 'enum',
    enum: ConditionType,
    default: ConditionType.CONTROL,
  })
  condition: ConditionType;

  @Column({ nullable: true })
  btnText?: string;

  @OneToMany(() => Hint, (h) => h.student)
  hints: Hint[];

  @ManyToMany(() => Problem, (p) => p.students, { onDelete: 'SET NULL' })
  @JoinTable()
  problems: Problem[];

  @OneToMany(() => Logger, (p) => p.student)
  logs: Logger[];
}
