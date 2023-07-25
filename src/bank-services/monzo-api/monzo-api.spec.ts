import { Test, TestingModule } from '@nestjs/testing';
import { MonzoApi } from './monzo-api.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { BankModule } from '../bank.module';
import { lastValueFrom, of } from 'rxjs';
import { ExternalApis } from '../external-apis/external-apis.service';
import { AxiosResponse } from 'axios';
import MonzoTransaction from 'src/data-types/monzo-transaction';
import UnifiedTransaction from 'src/data-types/unified-transaction';

describe('MonzoApi', () => {
  let monzoApi: MonzoApi;
  let httpService: HttpService;
  let externalApis: ExternalApis;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, BankModule],
      providers: [MonzoApi],
    }).compile();
    monzoApi = module.get<MonzoApi>(MonzoApi);
    httpService = module.get<HttpService>(HttpService);
    externalApis = module.get<ExternalApis>(ExternalApis);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should fetch and transform Monzo transactions to UnifiedTransaction', async () => {
    const mockMonzoResponse = {
      data: [mockMonzoTransaction],
    };

    jest
      .spyOn(httpService, 'get')
      .mockReturnValueOnce(of(mockMonzoResponse as AxiosResponse));

    const result = await lastValueFrom(monzoApi.fetchAndTransform());

    expect(result).toEqual(unifiedTransactionMock);
    expect(httpService.get).toHaveBeenCalledWith(externalApis.monzoApiUrl);
  });

  it('should throw an Error on an interface mismatch', async () => {
    const invalidResponse = {
      data: 'InvalidBody',
    };

    jest
      .spyOn(httpService, 'get')
      .mockReturnValueOnce(of(invalidResponse as AxiosResponse));

    await expect(
      lastValueFrom(monzoApi.fetchAndTransform()),
    ).rejects.toThrowError();
  });
});

const mockMonzoTransaction: MonzoTransaction = {
  id: 'tx_00006FqMjDcX443534534',
  created: '2023-04-01T08:00:00.000Z',
  description: 'David Lee',
  amount: -3500,
  currency: 'EUR',
  metadata: {
    reference: 'SEPA-0987655555',
  },
};

export const unifiedTransactionMock: UnifiedTransaction[] = [
  {
    amount: {
      currency: 'EUR',
      value: '-35.00',
    },
    created: '2023-04-01T08:00:00.000Z',
    description: 'David Lee',
    id: 'tx_00006FqMjDcX443534534',
    metadata: {
      source: 'Monzo',
    },
    reference: 'SEPA-0987655555',
    type: 'DEBIT',
  },
];
