import { BadRequestException, Injectable } from '@nestjs/common';
import UnifiedTransaction from './data-types/unified-transaction';
import { lastValueFrom, forkJoin, Observable } from 'rxjs';
import { RevolutApi } from './bank-services/revolut-api/revolut-api.service';
import { MonzoApi } from './bank-services/monzo-api/monzo-api.service';
import { SterlingApi } from './bank-services/sterling-api/sterling-api.service';
import { BankApi } from './bank-services/bank-api';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly revolutService: RevolutApi,
    private readonly monzoService: MonzoApi,
    private readonly sterlingService: SterlingApi,
  ) {
    this.bankServices = {
      revolut: revolutService,
      monzo: monzoService,
      sterling: sterlingService,
    };
  }

  bankServices: Record<string, BankApi>;

  async getOneBankTransactions(source: string): Promise<UnifiedTransaction[]> {
    if (this.bankServices[source] === undefined) {
      throw new BadRequestException('Requested source bank is not supported');
    }
    return await lastValueFrom(this.bankServices[source].fetchAndTransform());
  }

  async getAllTransactions(): Promise<UnifiedTransaction[]> {
    const forkJoinObservables: Record<
      string,
      Observable<UnifiedTransaction[]>
    > = {};

    for (const [bank, service] of Object.entries(this.bankServices)) {
      forkJoinObservables[bank] = service.fetchAndTransform();
    }
    const responses = await lastValueFrom(forkJoin(forkJoinObservables));
    const joinedResponses = new Array<UnifiedTransaction>().concat(
      ...Object.values(responses),
    );

    return joinedResponses;
  }
}
