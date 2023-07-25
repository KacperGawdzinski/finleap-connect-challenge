import { Test, TestingModule } from '@nestjs/testing';
import { SterlingApi } from './sterling-api.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { BankModule } from '../bank.module';
import { lastValueFrom, of } from 'rxjs';
import { ExternalApis } from '../external-apis/external-apis.service';
import { AxiosResponse } from 'axios';
import UnifiedTransaction from 'src/data-types/unified-transaction';
import SterlingTransaction from 'src/data-types/sterling-transaction';

describe('SterlingApi', () => {
  let sterlingApi: SterlingApi;
  let httpService: HttpService;
  let externalApis: ExternalApis;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, BankModule],
      providers: [SterlingApi],
    }).compile();
    sterlingApi = module.get<SterlingApi>(SterlingApi);
    httpService = module.get<HttpService>(HttpService);
    externalApis = module.get<ExternalApis>(ExternalApis);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should fetch and transform Sterling transactions to UnifiedTransaction', async () => {
    const mockSterlingResponse = {
      data: [mockSterlingTransaction],
    };

    jest
      .spyOn(httpService, 'get')
      .mockReturnValueOnce(of(mockSterlingResponse as AxiosResponse));

    const result = await lastValueFrom(sterlingApi.fetchAndTransform());

    expect(result).toEqual(unifiedTransactionMock);
    expect(httpService.get).toHaveBeenCalledWith(externalApis.sterlingApiUrl);
  });

  it('should throw an Error on an interface mismatch', async () => {
    const invalidResponse = {
      data: 'InvalidBody',
    };

    jest
      .spyOn(httpService, 'get')
      .mockReturnValueOnce(of(invalidResponse as AxiosResponse));

    await expect(
      lastValueFrom(sterlingApi.fetchAndTransform()),
    ).rejects.toThrowError();
  });
});

const mockSterlingTransaction: SterlingTransaction = {
  id: 'tx_00006FqMjDcX443534534',
  currency: 'EUR',
  amount: '-35.00',
  created: '2023-04-01T08:00:00.000Z',
  direction: 'OUT',
  narrative: 'David Lee',
  reference: 'SEPA-0987655555',
};

const unifiedTransactionMock: UnifiedTransaction[] = [
  {
    amount: {
      currency: 'EUR',
      value: '-35.00',
    },
    created: '2023-04-01T08:00:00.000Z',
    description: 'David Lee',
    id: 'tx_00006FqMjDcX443534534',
    metadata: {
      source: 'Sterling',
    },
    reference: 'SEPA-0987655555',
    type: 'DEBIT',
  },
];
