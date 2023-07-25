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
      data: [mockRevolutTransaction],
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

const mockRevolutTransaction: RevolutTransaction = {
  id: 'tx_00006FqMjDcX443534534',
  created_at: '2023-04-01T08:00:00.000Z',
  completed_at: '2023-03-01T08:03:00.000Z',
  amount: {
    currency: 'EUR',
    value: '-35.00',
  },
  counterparty: {
    id: 'acc_1234567903',
    name: 'David Lee',
  },
  merchant: null,
  state: 'COMPLETED',
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
      source: 'Revolut',
    },
    reference: 'SEPA-0987655555',
    type: 'DEBIT',
  },
];
