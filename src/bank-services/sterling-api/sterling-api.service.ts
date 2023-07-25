import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map } from 'rxjs';
import SterlingTransaction from 'src/data-types/sterling-transaction';
import UnifiedTransaction from 'src/data-types/unified-transaction';
import { z } from 'zod';
import { BankApi } from '../bank-api';
import { ExternalApis } from '../external-apis/external-apis.service';

@Injectable()
export class SterlingApi implements BankApi {
  constructor(
    private readonly httpService: HttpService,
    private readonly externalApiService: ExternalApis,
  ) {}

  fetchAndTransform = () => {
    return this.httpService.get(this.externalApiService.sterlingApiUrl).pipe(
      map((response) => {
        return z
          .array(SterlingTransaction)
          .parse(response.data)
          .map(this.sterlingTransactionToUnifiedTransaction);
      }),
    );
  };

  sterlingTransactionToUnifiedTransaction = (
    transaction: SterlingTransaction,
  ): UnifiedTransaction => {
    return {
      id: transaction.id,
      created: transaction.created.toISOString(),
      description: transaction.narrative,
      amount: {
        currency: transaction.currency,
        value: transaction.amount,
      },
      type: transaction.amount.startsWith('-') ? 'DEBIT' : 'CREDIT',
      reference: transaction.reference,
      metadata: {
        source: 'Sterling',
      },
    };
  };
}
