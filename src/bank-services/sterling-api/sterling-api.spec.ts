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
      data: mockSterlingTransaction,
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

const mockSterlingTransaction: SterlingTransaction[] = [
  {
    id: '902f06f1-c3ce-42fc-b85c-b93b0fc0be9f',
    currency: 'EUR',
    amount: '-12.99',
    direction: 'OUT',
    narrative: 'Online shopping',
    created: new Date('2023-04-01T11:11:00.000Z'),
    reference: 'SEPA-1234567893',
  },
  {
    id: 'e90a5c5f-4e80-4d4f-a1f3-7e8825cf5fb5',
    currency: 'EUR',
    amount: '45.00',
    direction: 'IN',
    narrative: 'Refund for returned item',
    created: new Date('2023-04-03T08:17:00.000Z'),
    reference: 'SEPA-1234567894',
  },
];

const unifiedTransactionMock: UnifiedTransaction[] = [
  {
    id: '902f06f1-c3ce-42fc-b85c-b93b0fc0be9f',
    created: '2023-04-01T11:11:00.000Z',
    description: 'Online shopping',
    amount: {
      currency: 'EUR',
      value: '-12.99',
    },
    metadata: {
      source: 'Sterling',
    },
    reference: 'SEPA-1234567893',
    type: 'DEBIT',
  },
  {
    id: 'e90a5c5f-4e80-4d4f-a1f3-7e8825cf5fb5',
    created: '2023-04-03T08:17:00.000Z',
    description: 'Refund for returned item',
    amount: {
      currency: 'EUR',
      value: '45.00',
    },
    metadata: {
      source: 'Sterling',
    },
    reference: 'SEPA-1234567894',
    type: 'CREDIT',
  },
];
