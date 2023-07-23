import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import revolutTransaction from './dataTypes/revolutTransaction';
import { map, lastValueFrom } from 'rxjs';

@Injectable()
export class TransactionsService {
  constructor(private readonly httpService: HttpService) {}

  getTransactions(): Promise<revolutTransaction[] | void> {
    return lastValueFrom(
      this.httpService.get('http://mocked-banks/api/revolut').pipe(
        map((response) => {
          if (isRevolutTransaction(response.data)) {
            return response.data;
          } else {
            throw new Error(
              'Mismatch between revolutTransaction interface and response from API',
            );
          }
        }),
      ),
    );
  }
}

const isRevolutTransaction = (
  transaction: unknown,
): transaction is revolutTransaction[] => {
  return true;
};
