import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { IStudent } from '../types';

@Entity()
@ObjectType()
export class Student implements IStudent {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: string;

  @Column()
  utorId: string;
}
