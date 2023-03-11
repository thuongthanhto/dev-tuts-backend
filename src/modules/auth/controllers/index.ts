import { Controller, Get } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor() {
    console.log('init auth controller');
  }

  @Get('/')
  test() {
    return 'Hello World!';
  }
}
