import { Column } from 'typeorm';
import { HintType, IConditionType, VisibilityConditionType } from '../types';

export class ConditionType implements IConditionType {
  @Column({
    type: 'enum',
    enum: VisibilityConditionType,
    default: VisibilityConditionType.EXPERIMENT,
  })
  visibility: VisibilityConditionType;

  @Column({
    type: 'enum',
    enum: HintType,
    default: HintType.TEXT,
  })
  type: HintType;
}
