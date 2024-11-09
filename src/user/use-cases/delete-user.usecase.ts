import { Injectable } from '@nestjs/common';
import { User } from 'src/common/entities';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FindUserByIdUseCase } from './find-user-by-id.usecase';
import { UserCache } from '../user.cache';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly findUserByIdUserCase: FindUserByIdUseCase,
    private readonly userCache: UserCache,
  ) {}

  async execute(id: number): Promise<void> {
    try {
      const user: User = await this.findUserByIdUserCase.execute(id);

      const deleteResult: DeleteResult = await this.userRepository.delete(
        user.id,
      );

      if (deleteResult.affected > 0) {
        await this.userCache.deleteUserCache(user);
      }
    } catch (error: unknown) {
      throw error;
    }
  }
}
