import {
  Body,
  Controller,
  Get,
  Request,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './services/auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AccessTokenGuard } from '../../core/guards';
import { RefreshTokenGuard } from '../../core/guards/refresh-token.guard';
import { LoginResponseType } from './auth.types';
import {
  AuthFacebookLoginDto,
  AuthForgotPasswordDto,
  AuthGoogleLoginDto,
  AuthResetPasswordDto,
} from './dto';
import { AuthGoogleService } from './services/auth-google.service';
import { AuthFacebookService } from './services/auth-facebook.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private authGoogleService: AuthGoogleService,
    private authFacebookService: AuthFacebookService,
  ) {}

  @Post('/signup')
  signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  signIn(
    @Body() authEmailLoginDto: AuthEmailLoginDto,
  ): Promise<LoginResponseType> {
    return this.authService.signIn(authEmailLoginDto);
  }

  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/logout')
  logout(@Request() req) {
    return this.authService.logout(req.user['email']);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('/refresh-token')
  refresh(@Request() req) {
    const refreshToken = req.user['refresh_token'];
    const email = req.user['email'];
    return this.authService.refresh(email, refreshToken);
  }

  @Post('/google')
  @HttpCode(HttpStatus.OK)
  async loginGoogle(
    @Body() loginDto: AuthGoogleLoginDto,
  ): Promise<LoginResponseType> {
    const socialData = await this.authGoogleService.getProfileByToken(loginDto);

    return this.authService.validateSocialLogin('google', socialData);
  }

  @Post('facebook')
  @HttpCode(HttpStatus.OK)
  async loginFacebook(
    @Body() loginDto: AuthFacebookLoginDto,
  ): Promise<LoginResponseType> {
    const socialData =
      await this.authFacebookService.getProfileByToken(loginDto);

    return this.authService.validateSocialLogin('facebook', socialData);
  }

  @Post('forgot/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async forgotPassword(
    @Body() forgotPasswordDto: AuthForgotPasswordDto,
  ): Promise<void> {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  // @Post('reset/password')
  // @HttpCode(HttpStatus.NO_CONTENT)
  // resetPassword(@Body() resetPasswordDto: AuthResetPasswordDto): Promise<void> {
  //   return this.authService.resetPassword(
  //     resetPasswordDto.hash,
  //     resetPasswordDto.password,
  //   );
  // }
}
