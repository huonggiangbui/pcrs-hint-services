import {
  Entity,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  PrimaryColumn,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ConditionType, IStudent } from '../types';
import { Hint } from './hint.entity';
import { Problem } from './problem.entity';
import { Logger } from './logger.entity';

@Entity()
@Index(['uid', 'condition', 'btnText'], { unique: true })
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
    onDelete: 'SET NULL',
    cascade: true,
  })
  @JoinTable()
  problems: Promise<Problem[]>;

  @OneToMany(() => Logger, (p) => p.student)
  logs: Promise<Logger[]>;
}
