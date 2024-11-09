import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Transport } from '@nestjs/microservices';
import { KAFKA_GROUP_ID } from './common/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.connectMicroservice(
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [process.env.KAFKA_BROKER || 'nest_kafka:9092'],
        },
        consumer: {
          groupId: KAFKA_GROUP_ID,
        },
      },
    },
    { inheritAppConfig: true },
  );

  const config = new DocumentBuilder()
    .setTitle('Starsoft Backend Challenge')
    .setDescription(
      'This is the documentation for the Starsoft Backend Challenge',
    )
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory);

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
