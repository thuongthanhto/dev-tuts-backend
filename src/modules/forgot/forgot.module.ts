import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForgotService } from './forgot.service';
import { Forgot } from '../database/entities/forgot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Forgot])],
  providers: [ForgotService],
  exports: [ForgotService],
})
export class ForgotModule {}
