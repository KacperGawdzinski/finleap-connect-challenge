import { Test, TestingModule } from '@nestjs/testing';
import { MonzoApi } from './monzo-api.service';

describe('MonzoApi', () => {
  let provider: MonzoApi;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MonzoApi],
    }).compile();

    provider = module.get<MonzoApi>(MonzoApi);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
