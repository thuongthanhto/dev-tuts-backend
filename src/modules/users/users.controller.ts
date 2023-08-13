import {
  Body,
  Controller,
  Get,
  Logger,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { UsersService } from './users.service';
import { User } from '../database/entities';
import { AccessTokenGuard } from '../../core/guards';

@Controller('users')
@UseGuards(AccessTokenGuard)
export class UsersController {
  private logger = new Logger('UsersController');
  constructor(
    private readonly usersService: UsersService,
    private configService: ConfigService,
  ) {}

  @Get()
  getUsers(@Query() filterDto: GetUsersFilterDto): Promise<User[]> {
    this.logger.verbose(`Filters: ${JSON.stringify(filterDto)}`);
    return this.usersService.getUsers(filterDto);
  }
}
