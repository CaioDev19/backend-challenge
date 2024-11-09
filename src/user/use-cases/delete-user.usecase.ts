import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/common/entities';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FindUserByIdUseCase } from './find-user-by-id.usecase';
import { UserCache } from '../user.cache';
import { ClientKafka } from '@nestjs/microservices';
import { KAFKA_SERVICE_TOKEN } from 'src/common/constants';
import { KafkaTopic } from 'src/kafka/enums';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly findUserByIdUserCase: FindUserByIdUseCase,
    private readonly userCache: UserCache,
    @Inject(KAFKA_SERVICE_TOKEN) private readonly kafkaClient: ClientKafka,
  ) {}

  async execute(id: number): Promise<void> {
    try {
      const user: User = await this.findUserByIdUserCase.execute(id);

      const deleteResult: DeleteResult = await this.userRepository.delete(
        user.id,
      );

      if (deleteResult.affected > 0) {
        await this.userCache.deleteUserCache(user);
        this.kafkaClient.emit(KafkaTopic.UserDeleted, {
          userId: id,
        });
      }
    } catch (error: unknown) {
      throw error;
    }
  }
}
