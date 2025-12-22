import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {

  const logger = new Logger('Payments-ms');

  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );


  app.connectMicroservice({
    transport: Transport.NATS,
    options: {
      servers: envs.natsServers,
    },
  },{
    inheritAppConfig: true,
  })

  await app.startAllMicroservices();
  await app.listen(envs.port ?? 3000);

  logger.log(`Payments-ms is running on port ${envs.port ?? 3000}`);
}
bootstrap();
