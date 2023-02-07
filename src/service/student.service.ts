import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HINT_BUTTON_TEXT } from 'src/constants';
import { Problem } from 'src/entity/problem.entity';
import { Student } from 'src/entity/student.entity';
import { ConditionType, HintType } from 'src/types';
import { NullDeciderType, randomize } from 'src/utils/randomize';
import { Repository } from 'typeorm';

type BasicStudentData = {
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

  /**
   * Finds the first student entity given <data>.
   * @param data 
   * @returns A student entity matching data, null otherwise.
   */
  async findOne(data: BasicStudentData): Promise<Student> {
    return await this.studentRepository.findOne({
      where: { ...data },
    });
  }

/**
   * Creates a student entity and saves it to the repository.
   * @param data 
   * @returns A new student entity
   */
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

  /**
   * Updates the <problem> associated with <student>.
   * @param student 
   * @param problem 
   */
  async updateProblem(student: Student, problem: Problem) {
    (await student.problems).push(problem);
    await this.studentRepository.save(student);
  }

  /**
   * Randomizes whether or not a student is in the control or experiment group
   * @returns 
   */
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
