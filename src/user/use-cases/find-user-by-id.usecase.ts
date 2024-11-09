import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/common/entities';
import { Repository } from 'typeorm';
import { UserCache } from '../user.cache';

@Injectable()
export class FindUserByIdUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userCache: UserCache,
  ) {}

  async execute(id: number): Promise<User> {
    const cachedUser: User | undefined = await this.userCache.getById(id);

    if (cachedUser) {
      return cachedUser;
    }

    const user: User = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.userCache.setById(id, user);

    return user;
  }
}
