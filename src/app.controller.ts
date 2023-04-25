import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { resolve } from 'path';
import { Public } from './decorators/public.decorator';

@Controller()
export class AppController {
  @Public()
  @Get('.well-known/pki-validation/6DC64225FDA8C517652013AFE42706A5.txt')
  pkiValidation(@Res() res: Response) {
    res.sendFile(resolve('./6DC64225FDA8C517652013AFE42706A5.txt'));
  }
}
