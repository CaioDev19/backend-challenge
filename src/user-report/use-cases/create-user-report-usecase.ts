import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserReport } from 'src/common/entities';
import { UserReportAction } from 'src/common/enums/user-report-action';
import { FindUserByIdUseCase } from 'src/user/use-cases';
import { Repository } from 'typeorm';

@Injectable()
export class CreateUserReportUseCase {
  constructor(
    @InjectRepository(UserReport)
    private readonly userReportRepository: Repository<UserReport>,
    private readonly findUserByIdUserCase: FindUserByIdUseCase,
  ) {}

  async execute(userId: number, action: UserReportAction): Promise<void> {
    try {
      const user: User = await this.findUserByIdUserCase.execute(userId);

      const userReport: UserReport = this.userReportRepository.create({
        action,
        user,
      });

      await this.userReportRepository.save(userReport);
    } catch (error: unknown) {
      throw error;
    }
  }
}
