import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from 'src/common/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCache } from '../user.cache';
import { ClientKafka } from '@nestjs/microservices';
import { KAFKA_SERVICE_TOKEN } from 'src/common/constants';
import { KafkaTopic } from 'src/kafka/enums';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userCache: UserCache,
    @Inject(KAFKA_SERVICE_TOKEN) private readonly kafkaClient: ClientKafka,
  ) {}

  async execute(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const updatedUser: User = await this.userRepository.preload({
        id,
        ...updateUserDto,
      });

      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      const updateResponse: User = await this.userRepository.save(updatedUser);

      if (updateResponse) {
        await this.userCache.setUserCache(updateResponse);
        this.kafkaClient.emit(KafkaTopic.UserUpdated, { userId: id });
      }

      return updateResponse;
    } catch (error: unknown) {
      throw error;
    }
  }
}
