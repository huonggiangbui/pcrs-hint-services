export class CreateProblemDto {
  pk: string;
  typeExperiment: boolean;
  crossover?: boolean;
  name?: string;
  description?: string;
  solution?: string;
  starter_code?: string;
}
