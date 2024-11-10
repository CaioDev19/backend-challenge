import { Module } from '@nestjs/common';
import { UserReportController } from './user-report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserReport } from 'src/common/entities';
import { CreateUserReportUseCase } from './use-cases';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserReport]), UserModule],
  controllers: [UserReportController],
  providers: [CreateUserReportUseCase],
  exports: [TypeOrmModule],
})
export class UserReportModule {}
