import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { KafkaTopic } from 'src/kafka/enums';
import { CreateUserReportUseCase } from './use-cases';
import { UserReportAction } from 'src/common/enums/user-report-action';
import { UserReportEventDto } from './dto';

@Controller()
export class UserReportController {
  constructor(
    private readonly createUserReportUsecase: CreateUserReportUseCase,
  ) {}

  @EventPattern(KafkaTopic.UserCreated)
  async createdUser(message: UserReportEventDto): Promise<void> {
    await this.createUserReportUsecase.execute(
      message.userId,
      UserReportAction.Created,
    );
  }

  @EventPattern(KafkaTopic.UserDeleted)
  async deletedUser(message: UserReportEventDto): Promise<void> {
    await this.createUserReportUsecase.execute(
      message.userId,
      UserReportAction.Deleted,
    );
  }

  @EventPattern(KafkaTopic.UserUpdated)
  async updatedUser(message: UserReportEventDto): Promise<void> {
    await this.createUserReportUsecase.execute(
      message.userId,
      UserReportAction.Updated,
    );
  }
}
