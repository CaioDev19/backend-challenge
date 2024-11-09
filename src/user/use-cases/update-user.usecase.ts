import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from 'src/common/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCache } from '../user.cache';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userCache: UserCache,
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
      }

      return updateResponse;
    } catch (error: unknown) {
      throw error;
    }
  }
}
