import { Column } from 'typeorm';
import { IUIConfig } from '../types';

export class UIConfig implements IUIConfig {
  @Column()
  title?: string;

  @Column()
  description?: string;

  @Column()
  level?: number;

  @Column()
  more?: boolean;

  @Column()
  feedback?: boolean;
}
