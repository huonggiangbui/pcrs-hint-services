import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HintButtonText } from 'src/constants';
import { Problem } from 'src/entity/problem.entity';
import { Student } from 'src/entity/student.entity';
import { ConditionType } from 'src/types';
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
    const randomizedCondition = Math.floor(Math.random() * 2);
    const condition =
      randomizedCondition === 0
        ? ConditionType.CONTROL
        : ConditionType.EXPERIMENT;
    const randomizedHintButton = Math.floor(
      Math.random() * (HintButtonText.length + 1),
    ); // randomized between all hint button text + no text
    const btnText =
      randomizedHintButton === HintButtonText.length
        ? null
        : HintButtonText[randomizedHintButton];
    return { condition, btnText };
  }
}
