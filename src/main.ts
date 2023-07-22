import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { serveMockedApi } from './mockedApi/server';

async function bootstrap() {
  await serveMockedApi();
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
