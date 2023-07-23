import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { TransactionsService } from './transactions.service';

import revolutTransaction from './dataTypes/revolutTransaction';

@Controller()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get('/transactions')
  async getTransactions(): Promise<revolutTransaction[] | void> {
    try {
      const responseData = await this.transactionsService.getTransactions();
      return responseData;
    } catch (err) {
      if (err instanceof Error) {
        throw new InternalServerErrorException(err.message);
      } else {
        throw new InternalServerErrorException('Unknown error occured');
      }
    }
  }
}
