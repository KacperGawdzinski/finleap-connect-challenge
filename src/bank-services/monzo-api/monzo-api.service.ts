import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map } from 'rxjs';
import MonzoTransaction from 'src/data-types/monzo-transaction';
import UnifiedTransaction from 'src/data-types/unified-transaction';
import { z } from 'zod';
import { BankApi } from '../bank-api';
import { ExternalApis } from '../external-apis/external-apis.service';

@Injectable()
export class MonzoApi implements BankApi {
  constructor(
    private readonly httpService: HttpService,
    private readonly externalApiService: ExternalApis,
  ) {}

  fetchAndTransform = () => {
    return this.httpService.get(this.externalApiService.monzoApiUrl).pipe(
      map((response) => {
        return z
          .array(MonzoTransaction)
          .parse(response.data)
          .map(this.monzoTransactionToUnifiedTransaction);
      }),
    );
  };

  monzoTransactionToUnifiedTransaction = (
    transaction: MonzoTransaction,
  ): UnifiedTransaction => {
    return {
      id: transaction.id,
      created: transaction.created.toISOString(),
      description: transaction.description,
      amount: {
        currency: transaction.currency,
        value: (transaction.amount / 100).toFixed(2),
      },
      type: transaction.amount < 0 ? 'DEBIT' : 'CREDIT',
      reference: transaction.metadata.reference,
      metadata: {
        source: 'Monzo',
      },
    };
  };
}
