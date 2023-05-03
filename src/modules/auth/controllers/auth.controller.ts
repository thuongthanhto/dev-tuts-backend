import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import { AuthEmailLoginDto } from '../dto/auth-email-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  signIn(
    @Body() authEmailLoginDto: AuthEmailLoginDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authEmailLoginDto);
  }

  @Post('/test')
  @UseGuards(AuthGuard())
  test(@Body('token') token: string) {
    console.log(token);
  }
}
