// import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Root,
} from '@nestjs/graphql';
import { Hint } from '../entity/hint.entity';

@Resolver(() => Hint)
export class HintResolver {
  // constructor(
  //   private classService: KlassService,
  //   private assignmentService: AssignmentService
  // ) { }
  @Query(() => String)
  hello(): string {
    return 'Hi';
  }

  @Query(() => Hint, { nullable: true })
  getHint(): Hint {
    return null;
  }
}
