import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { PaginationQueryDto } from 'src/common/dto/pagination/pagination-query.dto';
import { PaginationDto } from 'src/common/dto/pagination/pagination.dto';
import { User } from 'src/common/entities';
import { REDIS_CACHE_TTL } from 'src/common/enums/redis-ttl';
import { Pagination } from 'src/common/pagination/pagination.service';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async findByEmail(email: string): Promise<User | undefined> {
    try {
      const cachedUser: User | undefined = (await this.cacheManager.get(
        `user_${email}`,
      )) as User | undefined;

      if (cachedUser) {
        return cachedUser;
      }

      const user: User | undefined = await this.userRepository.findOne({
        where: { email },
      });

      if (user) {
        await this.cacheManager.set(
          `user_${email}`,
          user,
          REDIS_CACHE_TTL.ONE_MINUTE,
        );
      }

      return user;
    } catch (error: unknown) {
      throw error;
    }
  }

  async findPaginated(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginationDto<User>> {
    try {
      const pagination: Pagination<User> = new Pagination(
        this.userRepository,
        paginationQuery,
      );

      return await pagination.paginate();
    } catch (error: unknown) {
      throw error;
    }
  }

  async findById(id: number): Promise<User | undefined> {
    try {
      const cachedUser: User | undefined = (await this.cacheManager.get(
        `user_${id}`,
      )) as User | undefined;

      if (cachedUser) {
        return cachedUser;
      }

      const user: User = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      await this.cacheManager.set(
        `user_${id}`,
        user,
        REDIS_CACHE_TTL.ONE_MINUTE,
      );

      return user;
    } catch (error: unknown) {
      throw error;
    }
  }

  async save(user: User): Promise<User> {
    try {
      const updatedUser: User = await this.userRepository.save(user);

      if (updatedUser) {
        await this.deleteUserCache(updatedUser);
      }

      return updatedUser;
    } catch (error: unknown) {
      throw error;
    }
  }

  async preload(id: number, updatedUser: Partial<User>): Promise<User> {
    return await this.userRepository.preload({ id, ...updatedUser });
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }

  async deleteUserCache(user: User): Promise<void> {
    await Promise.all([
      this.clearCache(`user_${user.email}`),
      this.clearCache(`user_${user.id}`),
    ]);
  }

  private async clearCache(cacheKey: string): Promise<void> {
    await this.cacheManager.del(cacheKey);
  }
}
