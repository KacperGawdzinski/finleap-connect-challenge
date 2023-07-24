import { Test, TestingModule } from '@nestjs/testing';
import { SterlingApi } from './sterling-api.service';

describe('SterlingApi', () => {
  let provider: SterlingApi;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SterlingApi],
    }).compile();

    provider = module.get<SterlingApi>(SterlingApi);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
