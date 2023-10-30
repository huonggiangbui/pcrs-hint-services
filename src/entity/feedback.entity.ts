import { IFeedback } from 'src/types';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Hint } from './hint.entity';
import { Student } from './student.entity';

@Entity()
@Unique(['hint', 'student'])
export class Feedback implements IFeedback {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Hint, (h) => h.feedback, {
    onDelete: 'CASCADE',
    lazy: true,
  })
  hint: Promise<Hint>;

  @ManyToOne(() => Student, (s) => s.feedback, {
    onDelete: 'CASCADE',
    lazy: true,
  })
  student: Promise<Student>;

  @Column({ nullable: true })
  likert_feedback?: number;

  @Column({ nullable: true })
  text_feedback?: string;
}
