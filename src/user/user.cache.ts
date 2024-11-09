import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { User } from 'src/common/entities';
import { REDIS_CACHE_TTL } from 'src/common/enums/redis-ttl';

@Injectable()
export class UserCache {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async getByEmail(email: string): Promise<User | undefined> {
    return (await this.cacheManager.get(`user_${email}`)) as User | undefined;
  }

  async setByEmail(email: string, user: User): Promise<void> {
    await this.cacheManager.set(
      `user_${email}`,
      user,
      REDIS_CACHE_TTL.ONE_MINUTE,
    );
  }

  async getById(id: number): Promise<User | undefined> {
    return (await this.cacheManager.get(`user_${id}`)) as User | undefined;
  }

  async setById(id: number, user: User): Promise<void> {
    await this.cacheManager.set(`user_${id}`, user, REDIS_CACHE_TTL.ONE_MINUTE);
  }

  async deleteUserCache(user: User): Promise<void> {
    await Promise.all([
      this.cacheManager.del(`user_${user.email}`),
      this.cacheManager.del(`user_${user.id}`),
    ]);
  }

  async setUserCache(user: User): Promise<void> {
    await Promise.all([
      this.setByEmail(user.email, user),
      this.setById(user.id, user),
    ]);
  }
}
