import { HintType, IConfig } from 'src/types';

export class HintDto {
  hint?: string;
  type?: HintType;
  config?: IConfig;
  prev?: number;
  next?: number;
}
