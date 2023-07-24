import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExternalApis } from './bank-services/external-apis/external-apis.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.get(ExternalApis).serveMockedApi();
  await app.listen(3000);
}
bootstrap();
