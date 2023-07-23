import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import RevolutTransaction from './dataTypes/RevolutTransaction';
import UnifiedTransaction from './dataTypes/UnifiedTransaction';
import { map, lastValueFrom, forkJoin, Observable } from 'rxjs';
import { z } from 'zod';

@Injectable()
export class TransactionsService {
  constructor(private readonly httpService: HttpService) {}

  getOneBankTransactions(): Promise<RevolutTransaction[] | void> {
    return lastValueFrom(
      this.httpService.get('http://mocked-banks/api/revolut').pipe(
        map((response) => {
          return z.array(RevolutTransaction).parse(response.data);
        }),
      ),
    );
  }

  async getTransactions(): Promise<UnifiedTransaction[] | void> {
    const forkJoinObservables: Record<
      string,
      Observable<UnifiedTransaction[]>
    > = {};

    for (const bank of getSupportedBanks()) {
      const config = BANK_TO_CONFIG[bank];
      forkJoinObservables[bank] = this.httpService.get(config.url).pipe(
        map((response) => {
          return z
            .array(config.parser)
            .parse(response.data)
            .map(config.transformFunction);
        }),
      );
    }

    const responses = await lastValueFrom(forkJoin(forkJoinObservables));
    const joinedResponses = new Array<UnifiedTransaction>().concat(
      ...Object.values(responses),
    );

    return joinedResponses;
  }
}

const revolutTransactionToUnifiedTransaction = (
  transaction: RevolutTransaction,
): UnifiedTransaction => {
  return {
    id: transaction.id,
    created: transaction.created_at,
    description: transaction.counterparty.name,
    amount: transaction.amount,
    type: transaction.amount.value.startsWith('-') ? 'DEBIT' : 'CREDIT',
    reference: transaction.reference,
    metadata: {
      source: 'Revolut',
    },
  };
};

const getSupportedBanks = (): Bank[] => {
  const supportedBanks = new Array<Bank>();
  for (const bank of Object.keys(BANK_TO_CONFIG)) {
    if (isSupportedBank(bank)) {
      supportedBanks.push(bank);
    }
  }
  return supportedBanks;
};

const isSupportedBank = (bank: string): bank is Bank => {
  return Object.keys(BANK_TO_CONFIG).includes(bank);
};

type BANK_TO_DATA_TYPE = { revolut: typeof RevolutTransaction };

type Bank = keyof BANK_TO_DATA_TYPE;

type BANK_CONFIG<T extends z.ZodType> = {
  url: string;
  transformFunction: (data: z.infer<T>) => UnifiedTransaction;
  parser: T;
};

const BANK_TO_CONFIG: {
  [T in Bank]: BANK_CONFIG<BANK_TO_DATA_TYPE[T]>;
} = {
  revolut: {
    url: 'http://mocked-banks/api/revolut',
    transformFunction: revolutTransactionToUnifiedTransaction,
    parser: RevolutTransaction,
  },
  // 'monzo': ['http://mocked-bank/api/monzo'],
  // 'sterling': ['http://mocked-bank/api/sterling'],
};
