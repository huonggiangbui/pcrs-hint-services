import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/.well-known/pki-validation/7F1464B6B2E19AA18E9DD5DF41BDDC4C.txt')
  getDomainAuth(): string {
    return this.appService.getDomainAuth();
  }
}
