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
    // search for problem with id and language
    // if not found, return error

    // else, found user associated with problem x language
    // if found, return config

    // else, randomize condition -> hint text -> hint type
    console.log(query);
    // return {};
    // throw new Error();
    return {
      btnText: 'Get hint',
    };
  }

  @Post('hints/:language/:id')
  async getHint(@Param() params, @Body() body): Promise<unknown> {
    console.log(body);
    // throw new Error();
    return {
      id: 3,
      type: 'text',
      // hint: 'x = 4\ny = 5',
      hint: '\n1) Should we check if the number of followers is greater than or equal to 0 before checking if the number of followers is less than 10?\n\n- Yes, because if the number of followers is less than 0, then it does not make sense to compare it to 10.\n\n2) Should we check if the number of followers is greater than or equal to 10 before checking if the number of followers is less than 100?\n\n- Yes, because if the number of followers is less than 10, then it does not make sense to compare it to 100.\n\n3) Should we check if the number of followers is greater than or equal to 100 before printing ""expert""?\n\n- No, because if the number of followers is greater than or equal to 100, we can print ""expert"".',
      config: {
        // title: 'Hint',
        // description: 'This is your hint:',
        level: 2, // 1 means all content is shown at once, 2 means the detailed hints are hidden(on toggle)
        more: true,
        feedback: true,
      },
    };
  }

  @Post('feedback/:language/:id')
  async sendFeedback(@Param() params, @Body() body): Promise<unknown> {
    console.log(body);
    // throw new Error();
    return {
      message: 'Feedback received',
      // showTextFeedback: true,
    };
  }

  @Post('logging/:language/:id')
  async logActivity(@Param() params, @Body() body): Promise<unknown> {
    // throw new Error();
    const timestamp = new Date();
    console.log(
      `${timestamp.toISOString()} | ${body.uid} ${body.action} ${params.id}`,
    );
    return {};
  }
}
