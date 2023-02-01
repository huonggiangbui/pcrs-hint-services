import {
  Entity,
  Index,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { IProblem, LanguageType } from 'src/types';
import { Hint } from './hint.entity';
import { Student } from './student.entity';

@Entity()
@Index(['pk', 'language'], { unique: true })
export class Problem implements IProblem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pk: string;

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

  @Column({ nullable: true })
  solution?: string;

  @Column({ nullable: true })
  starter_code?: string;

  @OneToMany(() => Hint, (h) => h.problem)
  hints: Promise<Hint[]>;

  @ManyToMany(() => Student, (s) => s.problems, {
    onDelete: 'SET NULL',
  })
  @JoinTable()
  students: Promise<Student[]>;
}
