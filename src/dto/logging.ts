import { ActionType } from 'src/types';

export class CreateLogRecordDto {
  uid: string;
  submission: string;
  action: ActionType;
}
