import {
  Entity,
  Column,
  OneToMany,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IStudent } from '../types';
import { Hint } from './hint.entity';
import { Problem } from './problem.entity';

@Entity()
export class Student implements IStudent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uid: string;

  @Column()
  condition: string;

  @Column()
  btnText?: string;

  @OneToMany(() => Hint, (h) => h.student)
  hints: Hint[];

  @ManyToMany(() => Problem, (p) => p.students)
  problems: Problem[];
}
