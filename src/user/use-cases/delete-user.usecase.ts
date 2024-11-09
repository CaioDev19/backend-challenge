import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../user.service';
import { User } from 'src/common/entities';
import { DeleteResult } from 'typeorm';

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly userService: UserService) {}

  async execute(id: number): Promise<void> {
    try {
      const user: User | undefined = await this.userService.findById(id);

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      const deleteResult: DeleteResult = await this.userService.delete(user.id);

      if (deleteResult.affected > 0) {
        await this.userService.deleteUserCache(user);
      }
    } catch (error: unknown) {
      throw error;
    }
  }
}
