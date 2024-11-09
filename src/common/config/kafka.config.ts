import { registerAs } from '@nestjs/config';

export default registerAs('kafka', () => ({
  broker: process.env.KAFKA_BROKER || 'nest_kafka:9092',
}));
