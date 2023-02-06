export interface IHint {
  id: number;
  type: HintType;
  prompt: string;
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
  id: number;
  uid: string;
  condition: ConditionType;
  btnText: string;
}

export enum ConditionType {
  CONTROL = 'control',
  EXPERIMENT = 'experiment',
}

export interface IUIConfig {
  title: string;
  description: string;
  level?: DetailLevelType;
  more: boolean;
  feedback: boolean;
}

export enum DetailLevelType {
  BOTTOM_OUT = 1,
  HIDDEN = 2,
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
