import { Test, TestingModule } from '@nestjs/testing';
import { ExternalApis } from './external-apis.service';

describe('ExternalApi', () => {
  let provider: ExternalApis;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExternalApis],
    }).compile();

    provider = module.get<ExternalApis>(ExternalApis);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
