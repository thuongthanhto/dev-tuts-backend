import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AccessTokenGuard, GoogleOauthGuard } from '../../core/guards';
import { RefreshTokenGuard } from '../../core/guards/refresh-token.guard';
import { AuthGoogleLoginDto } from './dto/auth-google-login.dto';
import { LoginResponseType } from './auth.types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  signIn(
    @Body() authEmailLoginDto: AuthEmailLoginDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    return this.authService.signIn(authEmailLoginDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/logout')
  logout(@Req() req: Request) {
    return this.authService.logout(req.user['email']);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('/refresh')
  refresh(@Req() req: Request) {
    console.log('request', req);
    const refreshToken = req.user['refresh_token'];
    const email = req.user['email'];
    console.log(refreshToken, email);
    return this.authService.refresh(email, refreshToken);
  }

  @Post('/google')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: AuthGoogleLoginDto) {
    console.log('loginDto', loginDto);
    const socialData = await this.authService.getProfileByToken(loginDto);

    console.log(socialData);

    return this.authService.validateSocialLogin('google', socialData);
  }
}
