import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { IHint, HintType } from '../types';
import { UIConfig } from './Config';
import { Student } from './Student';
import { Problem } from './problem.entity';
import { Logger } from './logger.entity';

@Entity()
export class Hint implements IHint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(() => Student)
  student: Student;

  @Column({
    type: 'enum',
    enum: HintType,
    default: HintType.TEXT,
  })
  type: HintType;

  @Column()
  hint: string;

  @Column()
  submission: string;

  @Column()
  feedback?: string;

  @Column(() => UIConfig)
  config: UIConfig;

  @ManyToOne(() => Problem, (p) => p.hints, { onDelete: 'CASCADE', lazy: true })
  problem: Problem;

  @OneToMany(() => Logger, (l) => l.hint)
  logs: Logger[];
}
