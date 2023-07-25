import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExternalApis } from './bank-services/external-apis/external-apis.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  try {
    await app.get(ExternalApis).serveMockedApi();
  } catch (err) {
    if (err instanceof Error) {
      console.error(
        `Unable to launch ExternalApisService. Error: ${err.message}`,
      );
    } else {
      console.error('Unable to launch ExternalApisService');
    }
  }

  await app.listen(3000);
}
bootstrap();
