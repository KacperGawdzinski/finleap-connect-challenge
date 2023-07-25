import {
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import UnifiedTransaction from './data-types/unified-transaction';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  async getTransactions(
    @Query('source') source?: string,
  ): Promise<UnifiedTransaction[]> {
    try {
      if (source) {
        return await this.transactionsService.getOneBankTransactions(source);
      } else {
        return await this.transactionsService.getAllTransactions();
      }
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      } else if (err instanceof Error) {
        throw new InternalServerErrorException(err.message);
      } else {
        throw new InternalServerErrorException('Unknown error occured');
      }
    }
  }
}
