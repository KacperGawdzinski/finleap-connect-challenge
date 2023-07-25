import { Test, TestingModule } from '@nestjs/testing';
import { ExternalApis } from './external-apis.service';

describe('ExternalApi', () => {
  let externalApis: ExternalApis;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExternalApis],
    }).compile();

    externalApis = module.get<ExternalApis>(ExternalApis);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('in production environment', () => {
    it('should return the production URLs for APIs', () => {
      process.env.NODE_ENV = 'production';
      externalApis.reloadService();

      expect(externalApis.revolutApiUrl).toBe(
        'http://official-production/api/revolut',
      );
      expect(externalApis.monzoApiUrl).toBe(
        'http://official-production/api/monzo',
      );
      expect(externalApis.sterlingApiUrl).toBe(
        'http://official-production/api/sterling',
      );
    });
  });

  describe('in non-production environment', () => {
    it('should return the mocked URLs for APIs', () => {
      process.env.NODE_ENV = 'development';
      externalApis.reloadService();

      expect(externalApis.revolutApiUrl).toBe(
        'http://mocked-banks/api/revolut',
      );
      expect(externalApis.monzoApiUrl).toBe('http://mocked-banks/api/monzo');
      expect(externalApis.sterlingApiUrl).toBe(
        'http://mocked-banks/api/sterling',
      );
    });
  });
});
