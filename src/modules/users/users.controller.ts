import { Controller, Logger, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccessTokenGuard } from '../../core/guards';

@Controller('users')
@UseGuards(AccessTokenGuard)
export class UsersController {
  private logger = new Logger('UsersController');
  constructor(private configService: ConfigService) {}
}
