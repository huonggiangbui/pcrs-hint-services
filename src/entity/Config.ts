import { Column } from 'typeorm';
import { DetailLevelType, IUIConfig } from '../types';

export class UIConfig implements IUIConfig {
  @Column({ nullable: true })
  title?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: DetailLevelType,
    default: DetailLevelType.BOTTOM_OUT,
    nullable: true,
  })
  level?: number;

  @Column({ nullable: true })
  more?: boolean;

  @Column({ nullable: true })
  feedback?: boolean;
}
