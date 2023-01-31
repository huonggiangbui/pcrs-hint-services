export interface IHint {
  id: number;
  type: HintType;
  hint: string;
  submission: string;
  feedback?: string;
  config: IUIConfig;
}

export enum HintType {
  TEXT = 'text',
  CODE = 'code',
}

export interface IStudent {
  uid: string;
  condition: ConditionType;
  btnText?: string;
}

export enum ConditionType {
  CONTROL = 'control',
  EXPERIMENT = 'experiment',
}

export interface IUIConfig {
  title?: string;
  description?: string;
  level?: number;
  more?: boolean;
  feedback?: boolean;
}

export interface IProblem {
  id: number;
  pk: string;
  name: string;
  language: LanguageType;
  description: string;
  solution?: string;
  starter_code?: string;
}

export enum LanguageType {
  SQL = 'sql',
}

export interface ILogger {
  id: number;
  timestamp: Date;
  action: ActionType;
}

export enum ActionType {
  REQUEST = 'request',
  FOLLOW = 'follow-up',
  CLOSE = 'close',
  EXPAND = 'expand',
}
