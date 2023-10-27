import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Problem } from 'src/entity/problem.entity';
import { Student } from 'src/entity/student.entity';
import { HintType, IConditionType, VisibilityConditionType } from '../types';
import { Repository } from 'typeorm';

type BasicStudentData = {
  uid: string;
  condition: IConditionType;
};

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  async findOne(data: BasicStudentData): Promise<Student> {
    return await this.studentRepository.findOne({
      where: { ...data },
    });
  }

  async filterStudent(students: Student[], uid: string): Promise<Student> {
    students = students.filter((s) => s.uid === uid);
    if (!students || students.length === 0) {
      throw new NotFoundException(`Student with uid ${uid} not found`);
    }
    return students[0];
  }

  async create(data: BasicStudentData): Promise<Student> {
    const student = await this.studentRepository.create(data);
    return student;
  }

  async updateProblemOfStudent(student: Student, problem: Problem) {
    (await student.problems).push(problem);
    await this.studentRepository.save(student);
  }

  async handleExperiment(): Promise<IConditionType> {
    // random between 1 and 100 (inclusive). If the results is <= 25, then control condition. Otherwise, experiment condition.
    const visibility =
      Math.floor(Math.random() * 100 + 1) <= 25
        ? VisibilityConditionType.CONTROL
        : VisibilityConditionType.EXPERIMENT;
    const type =
      Math.floor(Math.random() * 100 + 1) <= 50 ? HintType.TEXT : HintType.CODE;

    return { visibility, type };
  }
}
