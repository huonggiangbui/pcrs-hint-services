import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HINT_BUTTON_TEXT } from 'src/constants';
import { Problem } from 'src/entity/problem.entity';
import { Student } from 'src/entity/student.entity';
import { ConditionType } from 'src/types';
import { randomize } from 'src/utils/randomize';
import { Repository } from 'typeorm';

type BasicStudentData = {
  uid: string;
  condition: ConditionType;
  btnText: string;
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

  async create(problem: Problem, data: BasicStudentData): Promise<Student> {
    let student = await this.findOne(data);
    if (!student) {
      student = await this.studentRepository.create(data);
      student.problems = Promise.resolve([problem]);
      await this.studentRepository.save(student);
    } else {
      await this.updateProblem(student, problem);
    }
    return student;
  }

  async updateProblem(student: Student, problem: Problem) {
    (await student.problems).push(problem);
    await this.studentRepository.save(student);
  }

  async handleExperiment(): Promise<{
    condition: ConditionType;
    btnText?: string;
  }> {
    const condition = randomize([
      ConditionType.CONTROL,
      ConditionType.EXPERIMENT,
    ]);
    const btnText = randomize(HINT_BUTTON_TEXT);
    return { condition, btnText };
  }
}
