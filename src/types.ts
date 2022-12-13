export enum HintType {
  AUTOMATIC,
  STATIC,
}

export interface IHint {
  id: string;
  type: HintType;
  submission: ISubmission;
}

export interface IProblem {
  id: string;
  name: string;
  description: string;
  solution?: string;
  starter_code?: string;
}

export interface ISubmission {
  id: string;
  problem: IProblem;
  student: IStudent;
}

export interface IStudent {
  id: string;
  utorId: string;
}
