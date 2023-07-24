import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MonzoApi } from './monzo-api/monzo-api.service';
import { RevolutApi } from './revolut-api/revolut-api.service';
import { SterlingApi } from './sterling-api/sterling-api.service';
import { ExternalApis } from './external-apis/external-apis.service';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [RevolutApi, MonzoApi, SterlingApi, ExternalApis],
  exports: [RevolutApi, MonzoApi, SterlingApi, ExternalApis],
})
export class BankModule {}
