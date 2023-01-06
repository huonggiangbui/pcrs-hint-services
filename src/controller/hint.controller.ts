import {
  Body,
  Controller,
  Delete,
  Query,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { HintService } from 'src/service/hint.service';

@Controller()
export class HintController {
  constructor(private readonly hintService: HintService) {}

  @Get('config/:language/:id')
  async getConfig(@Param() params, @Query() query): Promise<unknown> {
    console.log(query);
    return {
      btnText: 'Get hint',
      limit: 1,
    };
  }

  @Post('hint/:language/:id')
  async getHint(@Param() params): Promise<unknown> {
    return {
      type: 'code',
      hint: 'x = 4\ny = 5',
      // 'hint': 'How does your code handle if the number of followers is less than 0?\n',
      config: {
        title: 'Hint',
        description: 'This is your hint:',
        level: 2, // 1 means all content is shown at once, 2 means the detailed hints are hidden(on toggle)
        more: true,
        feedback: true,
      },
    };
  }
}
