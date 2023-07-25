import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map } from 'rxjs';
import RevolutTransaction from 'src/data-types/revolut-transaction';
import UnifiedTransaction from 'src/data-types/unified-transaction';
import { z } from 'zod';
import { BankApi } from '../bank-api';
import { ExternalApis } from '../external-apis/external-apis.service';

@Injectable()
export class RevolutApi implements BankApi {
  constructor(
    private readonly httpService: HttpService,
    private readonly externalApiService: ExternalApis,
  ) {}

  fetchAndTransform = () => {
    return this.httpService.get(this.externalApiService.revolutApiUrl).pipe(
      map((response) => {
        return z
          .array(RevolutTransaction)
          .parse(response.data)
          .map(this.revolutTransactionToUnifiedTransaction);
      }),
    );
  };

  revolutTransactionToUnifiedTransaction = (
    transaction: RevolutTransaction,
  ): UnifiedTransaction => {
    return {
      id: transaction.id,
      created: transaction.created_at.toISOString(),
      description: `Transfer ${
        transaction.amount.value.startsWith('-') ? 'to' : 'from'
      } ${transaction.counterparty.name}`,
      amount: transaction.amount,
      type: transaction.amount.value.startsWith('-') ? 'DEBIT' : 'CREDIT',
      reference: transaction.reference,
      metadata: {
        source: 'Revolut',
      },
    };
  };
}
