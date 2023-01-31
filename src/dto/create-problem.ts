export class CreateProblemDto {
  pk: string;
  name: string;
  description: string;
  solution?: string;
  starter_code?: string;
}
