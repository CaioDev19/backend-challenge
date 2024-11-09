import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  KAFKA_CLIENT_ID,
  KAFKA_GROUP_ID,
  KAFKA_SERVICE_TOKEN,
} from 'src/common/constants';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: KAFKA_SERVICE_TOKEN,
        useFactory: async (configService: ConfigService) => ({
          name: KAFKA_SERVICE_TOKEN,
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: KAFKA_CLIENT_ID,
              brokers: [configService.getOrThrow('kafka.broker')],
            },
            consumer: {
              groupId: KAFKA_GROUP_ID,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class KafkaModule {}
