import {
  Controller,
  Get,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';

import RevolutTransaction from './dataTypes/RevolutTransaction';
import UnifiedTransaction from './dataTypes/UnifiedTransaction';

@Controller()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get('/transactions')
  async getTransactions(): Promise<UnifiedTransaction[] | void> {
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

  @Get('/transactions')
  async getOneBankTransactions(
    @Query('source') source: string,
  ): Promise<RevolutTransaction[] | void> {
    try {
      const responseData =
        await this.transactionsService.getOneBankTransactions();
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
