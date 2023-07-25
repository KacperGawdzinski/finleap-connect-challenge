import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { BankModule } from './bank-services/bank.module';

@Module({
  imports: [BankModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class AppModule {}
