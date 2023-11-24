import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Facebook } from 'fb';
import { ConfigService } from '@nestjs/config';
import { SocialInterface } from '../auth.types';
import { AllConfigType } from '../../../core/config/config.type';
import { AuthFacebookLoginDto } from '../dto';
import { FacebookInterface } from '../interfaces/facebook.interface';

@Injectable()
export class AuthFacebookService {
  private fb: Facebook;

  constructor(private configService: ConfigService<AllConfigType>) {
    this.fb = new Facebook({
      appId: configService.get('facebook.appId', {
        infer: true,
      }),
      appSecret: configService.get('facebook.appSecret', {
        infer: true,
      }),
      version: 'v7.0',
    });
  }

  async getProfileByToken(
    loginDto: AuthFacebookLoginDto,
  ): Promise<SocialInterface> {
    this.fb.setAccessToken(loginDto.accessToken);

    const data: FacebookInterface = await new Promise((resolve) => {
      this.fb.api(
        '/me',
        'get',
        { fields: 'id,last_name,email,first_name' },
        (response) => {
          resolve(response);
        },
      );
    });

    if (!data) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            user: 'wrongToken',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return {
      id: data.id,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
    };
  }
}
