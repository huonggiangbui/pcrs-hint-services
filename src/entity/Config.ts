import { Column } from 'typeorm';
import { IUIConfig } from '../types';

export class UIConfig implements IUIConfig {
  @Column({ nullable: true })
  title?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  level?: number;

  @Column({ nullable: true })
  more?: boolean;

  @Column({ nullable: true })
  feedback?: boolean;
}
