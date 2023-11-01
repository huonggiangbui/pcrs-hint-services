import { Column } from 'typeorm';
import { DetailLevelType, IConfig } from '../types';

export class Config implements IConfig {
  @Column({
    type: 'enum',
    enum: DetailLevelType,
    default: DetailLevelType.BOTTOM_OUT,
    nullable: true,
  })
  level?: DetailLevelType;
}
