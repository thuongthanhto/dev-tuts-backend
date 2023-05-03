import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import { JwtPayload } from '../types/jwt-payload.interface';
import { User } from '../../database/entities/user.entity';
import { AuthEmailLoginDto } from '../dto/auth-email-login.dto';

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

  async signIn(params: AuthEmailLoginDto): Promise<{ accessToken: string }> {
    const { email, password } = params;

    const user = await this.userRepository.findOneBy({ email });
    console.log(params);
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { email };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  async validateUser(email: string): Promise<User> {
    return await this.userRepository.findOneBy({ email });
  }
}
