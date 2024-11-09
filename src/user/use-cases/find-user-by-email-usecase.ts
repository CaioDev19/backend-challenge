import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/common/entities';
import { Repository } from 'typeorm';
import { UserCache } from '../user.cache';

@Injectable()
export class FindUserByEmailUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userCache: UserCache,
  ) {}

  async execute(email: string): Promise<User | undefined> {
    const cachedUser: User | undefined = await this.userCache.getByEmail(email);

    if (cachedUser) {
      return cachedUser;
    }

    const user: User | undefined = await this.userRepository.findOne({
      where: { email },
    });

    if (user) {
      await this.userCache.setByEmail(email, user);
    }

    return user;
  }
}
