import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/common/entities';
import { Repository } from 'typeorm';
import { FindUserByIdUseCase } from './find-user-by-id.usecase';
import { BcryptService } from 'src/common/bcrypt/bcrypt.service';
import { UpdateUserPasswordDto } from '../dto';
import { KAFKA_SERVICE_TOKEN } from 'src/common/constants';
import { ClientKafka } from '@nestjs/microservices';
import { KafkaTopic } from 'src/kafka/enums';

@Injectable()
export class UpdateUserPasswordUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly bcryptService: BcryptService,
    private readonly findUserByIdUserCase: FindUserByIdUseCase,
    @Inject(KAFKA_SERVICE_TOKEN) private readonly kafkaClient: ClientKafka,
  ) {}

  async execute(updateUserPasswordDto: UpdateUserPasswordDto): Promise<void> {
    try {
      const { id, currentPassword, newPassword } = updateUserPasswordDto;
      const user: User = await this.findUserByIdUserCase.execute(id);

      const isCurrentPasswordValid: boolean =
        await this.bcryptService.comparePassword(
          currentPassword,
          user.password,
        );

      if (!isCurrentPasswordValid) {
        throw new BadRequestException('Current password is not valid');
      }

      const newPasswordHashed: string =
        await this.bcryptService.hashPassword(newPassword);

      const updatedUser: User = this.userRepository.create({
        ...user,
        password: newPasswordHashed,
      });

      await this.userRepository.save(updatedUser);

      this.kafkaClient.emit(KafkaTopic.UserUpdated, { userId: id });
    } catch (error: unknown) {
      throw error;
    }
  }
}
