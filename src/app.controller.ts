import { Controller, Get, Res } from '@nestjs/common';
import { Public } from './decorators/public.decorator';

import { Response } from 'express';
import { resolve } from 'path';

@Controller()
export class AppController {
  @Public()
  @Get('hello')
  getHello() {
    return 'Hello World!';
  }

  @Public()
  @Get('.well-known/pki-validation/475D864FB2AAC2D106560F09A3524187.txt')
  pkiValidation(@Res() res: Response) {
    res.sendFile(resolve('./475D864FB2AAC2D106560F09A3524187.txt'));
  }
}
