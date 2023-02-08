import {
  Entity,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ConditionType, IStudent } from '../types';
import { Hint } from './hint.entity';
import { Problem } from './problem.entity';
import { Logger } from './logger.entity';

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

  @OneToMany(() => Hint, (h) => h.student)
  hints: Hint[];

  @ManyToMany(() => Problem, (p) => p.students, {
    cascade: true,
  })
  problems: Promise<Problem[]>;

  @OneToMany(() => Logger, (p) => p.student)
  logs: Promise<Logger[]>;
}
