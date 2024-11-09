import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/common/entities';
import { Repository } from 'typeorm';
import { FindUserByIdUseCase } from './find-user-by-id.usecase';
import { BcryptService } from 'src/common/bcrypt/bcrypt.service';
import { UpdateUserPasswordDto } from '../dto';

@Injectable()
export class UpdateUserPasswordUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly bcryptService: BcryptService,
    private readonly findUserByIdUserCase: FindUserByIdUseCase,
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
    } catch (error: unknown) {
      throw error;
    }
  }
}
