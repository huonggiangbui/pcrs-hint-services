import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Submission } from 'src/submission/submission.entity';
import { Hint } from './hint.entity';
import { HintResolver } from './hint.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Hint, Submission])],
  providers: [HintResolver],
  exports: [],
})
export class HintModule {}
