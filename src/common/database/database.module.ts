import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeOrmConfig from './database.config';

@Module({
  imports: [TypeOrmModule.forRootAsync(typeOrmConfig)],
})
export class DatabaseModule {}
