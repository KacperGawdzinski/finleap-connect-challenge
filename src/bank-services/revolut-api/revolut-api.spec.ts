import { Test, TestingModule } from '@nestjs/testing';
import { RevolutApi } from './revolut-api.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { BankModule } from '../bank.module';
import { lastValueFrom, of } from 'rxjs';
import { ExternalApis } from '../external-apis/external-apis.service';
import RevolutTransaction from 'src/data-types/revolut-transaction';
import { AxiosResponse } from 'axios';
import UnifiedTransaction from 'src/data-types/unified-transaction';

describe('RevolutApi', () => {
  let revolutApi: RevolutApi;
  let httpService: HttpService;
  let externalApis: ExternalApis;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, BankModule],
      providers: [RevolutApi],
    }).compile();
    revolutApi = module.get<RevolutApi>(RevolutApi);
    httpService = module.get<HttpService>(HttpService);
    externalApis = module.get<ExternalApis>(ExternalApis);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should fetch and transform Revolut transactions to UnifiedTransaction', async () => {
    const mockRevolutResponse = {
      data: mockRevolutTransaction,
    };

    jest
      .spyOn(httpService, 'get')
      .mockReturnValueOnce(of(mockRevolutResponse as AxiosResponse));

    const result = await lastValueFrom(revolutApi.fetchAndTransform());

    expect(result).toEqual(unifiedTransactionMock);
    expect(httpService.get).toHaveBeenCalledWith(externalApis.revolutApiUrl);
  });

  it('should throw an Error on an interface mismatch', async () => {
    const invalidResponse = {
      data: 'InvalidBody',
    };

    jest
      .spyOn(httpService, 'get')
      .mockReturnValueOnce(of(invalidResponse as AxiosResponse));

    await expect(
      lastValueFrom(revolutApi.fetchAndTransform()),
    ).rejects.toThrowError();
  });
});

const mockRevolutTransaction: RevolutTransaction[] = [
  {
    id: 'tr_0987654321',
    created_at: new Date('2022-03-21T14:16:32.000Z'),
    completed_at: new Date('2022-03-21T14:18:32.000Z'),
    state: 'COMPLETED',
    amount: {
      currency: 'EUR',
      value: '-35.00',
    },
    counterparty: {
      id: 'acc_1234567903',
      name: 'David Lee',
    },
    merchant: null,
    reference: 'SEPA-0987654321',
  },
  {
    id: 'tr_1357908642',
    created_at: new Date('2023-04-01T08:00:00.000Z'),
    completed_at: new Date('2023-03-01T08:03:00.000Z'),
    amount: {
      currency: 'PLN',
      value: '23.00',
    },
    counterparty: {
      id: 'acc_5464667903',
      name: 'Martin King',
    },
    merchant: null,
    state: 'COMPLETED',
    reference: 'SEPA-0987632355',
  },
];

const unifiedTransactionMock: UnifiedTransaction[] = [
  {
    id: 'tr_0987654321',
    created: '2022-03-21T14:16:32.000Z',
    description: 'Transfer to David Lee',
    amount: {
      currency: 'EUR',
      value: '-35.00',
    },
    metadata: {
      source: 'Revolut',
    },
    reference: 'SEPA-0987654321',
    type: 'DEBIT',
  },
  {
    id: 'tr_1357908642',
    created: '2023-04-01T08:00:00.000Z',
    amount: {
      currency: 'PLN',
      value: '23.00',
    },
    metadata: {
      source: 'Revolut',
    },
    description: 'Transfer from Martin King',
    reference: 'SEPA-0987632355',
    type: 'CREDIT',
  },
];
