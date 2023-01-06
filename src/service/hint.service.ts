import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hint } from 'src/entity/hint.entity';
import { FindManyOptions, FindOneOptions, In, Repository } from 'typeorm';
import { HintType } from '../types';

@Injectable()
export class HintService {
  // constructor(
  //   @InjectRepository(Hint)
  //   private hintRepository: Repository<Hint>,
  // ) {}

  findOne(options: FindOneOptions<Hint>): Promise<Hint> {
    // return this.hintRepository.findOne(options);
    return Promise.resolve({
      id: '1',
      type: HintType.STATIC,
      submission: null,
    });
  }
}
