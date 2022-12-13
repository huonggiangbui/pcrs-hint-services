import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { IStudent } from 'src/types';
// import { Metadata } from '../utils/metadata.type';

@Entity()
@ObjectType()
export class Student implements IStudent {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: string;

  @Column()
  utorId: string;
}
