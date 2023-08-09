import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from '../database/entities/user.entity';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

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
        // duplicate email
        throw new ConflictException('Email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(
    params: AuthEmailLoginDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const { email, password } = params;

    const user = await this.userRepository.findOneBy({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const tokens = await this.getTokens(email);

      await this.updateRefreshToken(email, tokens.refresh_token);

      return tokens;
    } else {
      throw new UnauthorizedException('Please check your login credentials');
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
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          email,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
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
}
