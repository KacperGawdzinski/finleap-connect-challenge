import { Controller, Get } from '@nestjs/common';
import { TransactionsService } from './transactions.service';

import revolutTransaction from './dataTypes/revolutTransaction';

@Controller()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get('/transactions')
  async getTransactions(): Promise<revolutTransaction[]> {
    return await this.transactionsService.getTransactions();
  }
}
