import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './common/database/database.module';
import { UserModule } from './user/user.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RedisModule } from './common/redis/redis.module';
import { configs } from './common/config';
import { KafkaModule } from './kafka/kafka.module';
import { UserReportModule } from './user-report/user-report.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [...configs],
    }),
    DatabaseModule,
    KafkaModule,
    UserModule,
    RedisModule,
    UserReportModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
