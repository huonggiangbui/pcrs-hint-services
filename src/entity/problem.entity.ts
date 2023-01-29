import {
  Entity,
  Index,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { IProblem, LanguageType } from 'src/types';
import { Hint } from './hint.entity';
import { Student } from './student.entity';

@Entity()
export class Problem implements IProblem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: LanguageType,
    default: LanguageType.SQL,
  })
  language: LanguageType;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  solution?: string;

  @Column()
  starter_code?: string;

  @OneToMany(() => Hint, (h) => h.problem)
  hints: Hint[];

  @ManyToMany(() => Student, (s) => s.problems)
  students: Student[];
}
