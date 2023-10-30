import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const apiKey = req.headers['x-api-key'] ?? req.query.api_key; // checks the header, moves to query if null

    if (!apiKey) {
      Logger.error('No API key provided.');
      return false;
    }

    // call your env. var the name you want
    if (apiKey !== process.env.API_KEY) {
      Logger.error('Invalid API key provided.');
      return false;
    }

    return true;
  }
}
