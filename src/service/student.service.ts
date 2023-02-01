import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HINT_BUTTON_TEXT } from 'src/constants';
import { Problem } from 'src/entity/problem.entity';
import { Student } from 'src/entity/student.entity';
import { ConditionType, HintType } from 'src/types';
import { NullDeciderType, randomize } from 'src/utils/randomize';
import { Repository } from 'typeorm';

type CreateStudentData = {
  problem: Problem;
  uid: string;
  condition: ConditionType;
  btnText?: string;
};

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  async findByUid(uid: string): Promise<Student> {
    return await this.studentRepository.findOne({ where: { uid } });
  }

  async create(data: CreateStudentData): Promise<Student> {
    const { problem, ...others } = data;
    const student = await this.studentRepository.create(others);
    student.problems = [problem];
    await this.studentRepository.save(student);
    return student;
  }

  async handleExperiment(): Promise<{
    condition: ConditionType;
    btnText?: string;
  }> {
    const condition = randomize(
      [ConditionType.CONTROL, ConditionType.EXPERIMENT],
      NullDeciderType.NO_NULL,
    );
    const btnText = randomize(HINT_BUTTON_TEXT, NullDeciderType.ALLOW_NULL);
    return { condition, btnText };
  }
}
