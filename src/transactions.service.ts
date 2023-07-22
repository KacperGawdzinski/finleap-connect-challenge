import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import revolutTransaction from './dataTypes/revolutTransaction';
import { map, lastValueFrom } from 'rxjs';

@Injectable()
export class TransactionsService {
  constructor(private readonly httpService: HttpService) {}

  getTransactions(): Promise<revolutTransaction[]> {
    return lastValueFrom(
      this.httpService
        .get('http://mocked-banks/api/revolut')
        .pipe(map((response) => response.data)),
    );
  }
}
