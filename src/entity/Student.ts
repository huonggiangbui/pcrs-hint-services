import { Column } from 'typeorm';
import { IStudent } from '../types';

export class Student implements IStudent {
  @Column()
  uid: string;

  @Column()
  condition: string;

  @Column()
  btnText?: string;
}
