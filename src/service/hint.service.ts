import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hint } from 'src/entity/hint.entity';
import { LanguageType } from 'src/types';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class HintService {
  constructor(
    @InjectRepository(Hint)
    private hintRepository: Repository<Hint>,
  ) {}

  async findById(id: number, options: FindOneOptions<Hint>): Promise<Hint> {
    return this.hintRepository.findOneOrFail({ where: { id }, ...options });
  }

  async create(): Promise<Hint> {
    return;
  }
}
