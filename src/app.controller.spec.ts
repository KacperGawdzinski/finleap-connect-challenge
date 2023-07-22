import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

describe('AppController', () => {
  let appController: TransactionsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [TransactionsService],
    }).compile();

    appController = app.get<TransactionsController>(TransactionsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      // expect(appController.t()).toBe('Hello World!');
    });
  });
});
