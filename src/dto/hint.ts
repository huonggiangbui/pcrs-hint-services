import { HintType } from 'src/types';

export class HintDto {
  hint?: string;
  type?: HintType;
  prev?: number;
  next?: number;
}
