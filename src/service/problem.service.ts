import { Body, Injectable, Param } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Problem } from "src/entity/problem.entity";
import { Repository } from "typeorm";

@Injectable()
export class ProblemService {
    constructor(
        @InjectRepository(Problem) 
        private problemRepository: Repository<Problem>
    ) {}
    findAll(): Promise<Problem[]> {
        return this.problemRepository.find();
    }

    findOne(id: number): Promise<Problem> {
        return this.problemRepository.findOneBy({ id });
    }

    async remove(id: string): Promise<void> {
        await this.problemRepository.delete(id);
    }
    
   async createProblem(@Param() params, @Body() body): Promise<Problem>{
        console.log(body);
        const newProblem = this.problemRepository.create({
            id: body.pk,
            language: params.language,
            description: body.description,
            solution: body.solution,
            starter_code: body.starter_code,
            hints: [],
            students: []
        });
        return this.problemRepository.save(newProblem);
   }
}