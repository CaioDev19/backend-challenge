import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserReport } from 'src/common/entities';
import { UserReportAction } from 'src/common/enums/user-report-action';
import { Repository } from 'typeorm';

@Injectable()
export class CreateUserReportUseCase {
  constructor(
    @InjectRepository(UserReport)
    private readonly userReportRepository: Repository<UserReport>,
  ) {}

  async execute(userId: number, action: UserReportAction): Promise<void> {
    try {
      const userReport: UserReport = this.userReportRepository.create({
        userId,
        action,
      });

      await this.userReportRepository.save(userReport);
    } catch (error: unknown) {
      throw error;
    }
  }
}
