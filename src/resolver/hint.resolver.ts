// import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Root,
} from '@nestjs/graphql';
import { HintService } from 'src/service/hint.service';
import { HintType } from 'src/types';
import { Hint } from '../entity/hint.entity';

@Resolver(() => Hint)
export class HintResolver {
  constructor(private readonly hintService: HintService) {}

  @Query(() => Hint)
  async getStaticHint(): Promise<Hint> {
    return this.hintService.findOne({
      where: { type: HintType.STATIC },
    });
  }

  @Mutation(() => Boolean)
  async saveStaticHint(): Promise<boolean> {
    return true;
  }

  @Mutation(() => Hint)
  async generateAutomaticHint(): Promise<Hint> {
    return null;
  }
}
