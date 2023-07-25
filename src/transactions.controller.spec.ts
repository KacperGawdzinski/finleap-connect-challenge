import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { unifiedTransactionMock } from './bank-services/monzo-api/monzo-api.spec';
import { RevolutApi } from './bank-services/revolut-api/revolut-api.service';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { BankModule } from './bank-services/bank.module';
import { HttpModule } from '@nestjs/axios';

describe('AppController', () => {
  let transactionsController: TransactionsController;
  let transactionsService: TransactionsService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, BankModule],
      controllers: [TransactionsController],
      providers: [TransactionsService, RevolutApi],
    }).compile();

    transactionsController = app.get<TransactionsController>(
      TransactionsController,
    );
    transactionsService = app.get<TransactionsService>(TransactionsService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('getTransactions', () => {
    it('should return all transactions when the source is not provided', async () => {
      jest
        .spyOn(transactionsService, 'getAllTransactions')
        .mockResolvedValue(unifiedTransactionMock);

      const response = await transactionsController.getTransactions();
      expect(response).toEqual(unifiedTransactionMock);
    });

    it('should return unified transactions for one of the banks', async () => {
      const source = 'revolut';

      jest
        .spyOn(transactionsService, 'getOneBankTransactions')
        .mockResolvedValue(unifiedTransactionMock);

      const response = await transactionsController.getTransactions(source);
      expect(response).toEqual(unifiedTransactionMock);
    });

    it('should throw InternalServerErrorException when TransactionService throws an Error', async () => {
      const source = 'revolut';

      jest
        .spyOn(transactionsService, 'getOneBankTransactions')
        .mockImplementation(() => {
          throw new Error('Some error occurred in the service.');
        });

      await expect(
        transactionsController.getTransactions(source),
      ).rejects.toThrow(InternalServerErrorException);
    });

    it('should rethrow BadRequestException when trying to get not supported source bank', async () => {
      const source = 'revolot';
      const errorMessage = 'Requested source bank is not supported';

      const badRequestException = new BadRequestException(errorMessage);
      jest
        .spyOn(transactionsService, 'getOneBankTransactions')
        .mockRejectedValue(badRequestException);

      await expect(
        transactionsController.getTransactions(source),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
