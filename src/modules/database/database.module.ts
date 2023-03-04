import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from 'core/config/db.config';

@Module({
  imports: [ConfigModule, TypeOrmModule.forRoot(dbConfig)],
})
export class DatabaseModule {}
