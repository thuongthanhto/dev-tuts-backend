import {
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';

import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from '../database/entities';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthGoogleLoginDto } from './dto/auth-google-login.dto';
import { ConfigService } from '@nestjs/config';
import { LoginResponseType, SocialInterface } from './auth.types';
import { NullableType } from '../../core/utils/types/nullable.type';

@Injectable()
export class AuthService {
  private google: OAuth2Client;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.google = new OAuth2Client(
      configService.get('google.clientId', { infer: true }),
      configService.get('google.clientSecret', { infer: true }),
    );
  }

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { password, firstName, lastName, email } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      email,
      first_name: firstName,
      last_name: lastName,
      password: hashedPassword,
      active: true,
    });

    try {
      await this.userRepository.save(user);
    } catch (error) {
      console.log(error.code);
      console.log(error);
      if (error.code === '23505') {
        throw new ConflictException('Email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(params: AuthEmailLoginDto): Promise<LoginResponseType> {
    const { email, password } = params;

    const user = await this.userRepository.findOneBy({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const tokens = await this.getTokens(email);

      await this.updateRefreshToken(email, tokens.refresh_token);

      return {
        ...tokens,
        user: {
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          id: user.id,
          role: user.role,
        },
      };
    } else {
      throw new NotFoundException('Please check your login credentials');
    }
  }

  async validateUser(email: string): Promise<User> {
    return await this.userRepository.findOneBy({ email });
  }

  async updateRefreshToken(email: string, refreshToken: string): Promise<void> {
    const salt = await bcrypt.genSalt();
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);
    await this.userRepository.update(
      { email },
      { refresh_token: hashedRefreshToken },
    );
  }

  async getTokens(email: string): Promise<any> {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        {
          email,
        },
        {
          secret: process.env.AUTH_JWT_SECRET,
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          email,
        },
        {
          secret: process.env.AUTH_REFRESH_SECRET,
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }

  async logout(email: string): Promise<void> {
    await this.userRepository.update({ email }, { refresh_token: null });
  }

  async refresh(email: string, refreshToken: string) {
    const user = await this.userRepository.findOneBy({ email });

    if (!user || !user.refresh_token) {
      throw new ForbiddenException('Access Denied');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refresh_token,
    );

    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(email);

    await this.updateRefreshToken(email, tokens.refresh_token);

    return tokens;
  }

  async getProfileByToken(
    loginDto: AuthGoogleLoginDto,
  ): Promise<SocialInterface> {
    const ticket = await this.google.verifyIdToken({
      idToken: loginDto.idToken,
      audience: [
        this.configService.getOrThrow('google.clientId', { infer: true }),
      ],
    });

    const data = ticket.getPayload();

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
      id: data.sub,
      email: data.email,
      first_name: data.given_name,
      last_name: data.family_name,
    };
  }

  async validateSocialLogin(authProvider: string, socialData: SocialInterface) {
    let user: NullableType<User>;
    const socialEmail = socialData.email?.toLowerCase();
    user = await this.userRepository.findOneBy({
      email: socialEmail,
    });

    if (user) {
      const tokens = await this.getTokens(socialEmail);

      await this.updateRefreshToken(socialEmail, tokens.refresh_token);

      return {
        ...tokens,
        user_data: {
          ability: user.role.ability,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          id: user.id,
          role: user.role.name,
        },
      };
    } else {
      throw new NotFoundException('Please check your login credentials');
    }
  }
}
