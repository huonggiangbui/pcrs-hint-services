import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getDomainAuth(): string {
    return process.env.DOMAIN_AUTH_TEXT.split(',').join('\n') || '';
  }
}
