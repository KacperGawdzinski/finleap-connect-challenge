import { Observable } from 'rxjs';
import UnifiedTransaction from 'src/data-types/unified-transaction';

export interface BankApi {
  fetchAndTransform: () => Observable<UnifiedTransaction[]>;
}
