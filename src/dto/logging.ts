import { ActionType } from 'src/types';

export class CreateLogRecordDto {
  uid: string;
  action: ActionType;
  submission: string;
}
