import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  Unique,
} from 'typeorm';
import { IProblem, LanguageType } from '../types';
import { Hint } from './hint.entity';
import { Student } from './student.entity';

@Entity()
@Unique(['pk', 'language'])
export class Problem implements IProblem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pk: string;

  @Column({
    type: 'enum',
    enum: LanguageType,
    default: LanguageType.PYTHON,
  })
  language: LanguageType;

  @Column()
  typeExperiment: boolean;

  @Column({ nullable: true })
  crossover?: boolean;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  solution?: string;

  @Column({ nullable: true })
  starter_code?: string;

  @OneToMany(() => Hint, (h) => h.problem)
  hints: Promise<Hint[]>;

  @ManyToMany(() => Student, (s) => s.problems)
  @JoinTable()
  students: Promise<Student[]>;
}
