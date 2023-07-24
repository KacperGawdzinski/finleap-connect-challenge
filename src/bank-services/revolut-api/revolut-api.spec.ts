import { Test, TestingModule } from '@nestjs/testing';
import { RevolutApi } from './revolut-api';

describe('RevolutApi', () => {
  let provider: RevolutApi;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RevolutApi],
    }).compile();

    provider = module.get<RevolutApi>(RevolutApi);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
