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
      data: mockMonzoTransaction,
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

const mockMonzoTransaction: MonzoTransaction[] = [
  {
    id: 'tx_00006FqMjDcX443534534',
    created: new Date('2023-04-01T08:00:00.000Z'),
    description: 'Electricity bill payment',
    amount: -9500,
    currency: 'EUR',
    metadata: {
      reference: 'SEPA-0987655555',
    },
  },
  {
    id: 'tx_00001YpBqNqL8mWnKf4t2Z',
    created: new Date('2023-04-05T09:12:00.000Z'),
    description: 'Income',
    amount: 400000,
    currency: 'EUR',
    metadata: {
      reference: 'SEPA-0987654321',
    },
  },
];

export const unifiedTransactionMock: UnifiedTransaction[] = [
  {
    id: 'tx_00006FqMjDcX443534534',
    created: '2023-04-01T08:00:00.000Z',
    amount: {
      currency: 'EUR',
      value: '-95.00',
    },
    reference: 'SEPA-0987655555',
    description: 'Electricity bill payment',
    type: 'DEBIT',
    metadata: {
      source: 'Monzo',
    },
  },
  {
    id: 'tx_00001YpBqNqL8mWnKf4t2Z',
    created: '2023-04-05T09:12:00.000Z',
    amount: {
      currency: 'EUR',
      value: '4000.00',
    },
    reference: 'SEPA-0987654321',
    description: 'Income',
    type: 'CREDIT',
    metadata: {
      source: 'Monzo',
    },
  },
];
