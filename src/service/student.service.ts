import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HINT_BUTTON_COLOR, HINT_BUTTON_TEXT } from 'src/constants';
import { Problem } from 'src/entity/problem.entity';
import { Student } from 'src/entity/student.entity';
import { ConditionType } from '../types';
import { randomize } from 'src/utils/randomize';
import { Repository } from 'typeorm';

type BasicStudentData = {
  uid: string;
  condition: ConditionType;
  btnText: string | null;
  btnColor: string | null;
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

  async handleExperiment(): Promise<{
    condition: ConditionType;
    btnText: string | null;
    btnColor: string | null;
  }> {
    // random between 1 and 100 (inclusive). If the results is <= 25, then control condition. Otherwise, experiment condition.
    const random = Math.floor(Math.random() * 100 + 1);
    const condition =
      random <= 25 ? ConditionType.CONTROL : ConditionType.EXPERIMENT;
    let btnText = null;
    let btnColor = null;
    if (condition === ConditionType.EXPERIMENT) {
      btnText = randomize(HINT_BUTTON_TEXT);
      btnColor = randomize(HINT_BUTTON_COLOR);
    }
    return { condition, btnText, btnColor };
  }
}
