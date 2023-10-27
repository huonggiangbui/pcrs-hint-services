export interface IHint {
  id: number;
  type: HintType;
  hint: string;
  config: IConfig;
  prev?: number;
  next?: number;
}

export enum HintType {
  TEXT = 'text',
  CODE = 'code',
}

export interface IConfig {
  level?: DetailLevelType;
}

export enum DetailLevelType {
  BOTTOM_OUT = 'bottom_out',
  HIDDEN = 'hidden',
}

export interface IStudent {
  id: number;
  uid: string;
  condition: IConditionType;
  btnText?: string;
  btnColor?: string;
}

export interface IConditionType {
  visibility: VisibilityConditionType;
  type: HintType;
}

export enum VisibilityConditionType {
  CONTROL = 'control',
  EXPERIMENT = 'experiment',
}

export interface IFeedback {
  likert_feedback: number;
  text_feedback?: string;
}

export interface IProblem {
  id: number;
  pk: string;
  language: LanguageType;
  typeExperiment: boolean;
  crossover?: boolean;
  name?: string;
  description?: string;
  solution?: string;
  starter_code?: string;
}

export enum LanguageType {
  PYTHON = 'python',
}

export interface ILogger {
  id: number;
  timestamp: Date;
  action: ActionType;
  submission: string;
}

export enum ActionType {
  REQUEST = 'request',
  CLOSE = 'close',
  EXPAND = 'expand',
}
