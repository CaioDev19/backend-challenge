import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: configService.getOrThrow('redis.host'),
            port: configService.getOrThrow('redis.port'),
          },
        });

        return {
          store: store as unknown as CacheStore,
          ttl: 0,
        };
      },
    }),
  ],
})
export class RedisModule {}
