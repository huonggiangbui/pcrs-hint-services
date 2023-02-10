import { Injectable } from '@nestjs/common';
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
    const condition = randomize([
      ConditionType.CONTROL,
      ConditionType.EXPERIMENT,
    ]);
    let btnText = null;
    let btnColor = null;
    if (condition === ConditionType.EXPERIMENT) {
      btnText = randomize(HINT_BUTTON_TEXT);
      btnColor = randomize(HINT_BUTTON_COLOR);
    }
    return { condition, btnText, btnColor };
  }
}
