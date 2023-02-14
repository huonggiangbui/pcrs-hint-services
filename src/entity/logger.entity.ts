import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ILogger, ActionType } from '../types';
import { Hint } from './hint.entity';
import { Student } from './student.entity';

@Entity()
export class Logger implements ILogger {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  timestamp: Date;

  @Column({
    type: 'enum',
    enum: ActionType,
  })
  action: ActionType;

  @Column()
  submission: string;

  @ManyToOne(() => Hint, (h) => h.logs, { onDelete: 'CASCADE', lazy: true })
  hint: Promise<Hint>;

  @ManyToOne(() => Student, (s) => s.logs, { onDelete: 'CASCADE', lazy: true })
  student: Promise<Student>;
}
