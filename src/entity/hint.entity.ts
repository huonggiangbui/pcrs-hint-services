import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { IHint, HintType, HintAuthorType } from '../types';
import { UIConfig } from './Config';
import { Student } from './student.entity';
import { Problem } from './problem.entity';
import { Logger } from './logger.entity';
import { Feedback } from './feedback.entity';

@Entity()
export class Hint implements IHint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: HintType,
    default: HintType.TEXT,
  })
  type: HintType;

  @Column({ nullable: true })
  prompt?: string;

  @Column({
    type: 'enum',
    enum: HintAuthorType,
    default: HintAuthorType.INSTRUCTOR,
  })
  author: HintAuthorType;

  @Column()
  hint: string;

  @Column(() => UIConfig)
  config: UIConfig;

  @ManyToMany(() => Student, (s) => s.hints, {
    onDelete: 'CASCADE',
    lazy: true,
  })
  @JoinTable()
  students: Promise<Student[]>;

  @ManyToOne(() => Problem, (p) => p.hints, {
    onDelete: 'CASCADE',
    lazy: true,
    cascade: true,
  })
  problem: Promise<Problem>;

  @OneToMany(() => Logger, (l) => l.hint)
  logs: Promise<Logger[]>;

  @OneToMany(() => Feedback, (f) => f.hint)
  feedback: Promise<Feedback[]>;
}
