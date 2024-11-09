import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../user.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from 'src/common/entities';

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly userService: UserService) {}

  async execute(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const updatedUser: User = await this.userService.preload(
        id,
        updateUserDto,
      );

      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return await this.userService.save(updatedUser);
    } catch (error: unknown) {
      throw error;
    }
  }
}
