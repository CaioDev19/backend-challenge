import { Module } from '@nestjs/common';
import { UserReportController } from './user-report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserReport } from 'src/common/entities';
import { CreateUserReportUseCase } from './use-cases';

@Module({
  imports: [TypeOrmModule.forFeature([UserReport])],
  controllers: [UserReportController],
  providers: [CreateUserReportUseCase],
  exports: [TypeOrmModule],
})
export class UserReportModule {}
