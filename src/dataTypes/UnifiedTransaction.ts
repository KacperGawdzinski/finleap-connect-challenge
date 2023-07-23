import { z } from 'zod';

const UnifiedTransactionAmount = z.object({
  value: z.string(),
  currency: z.string(),
});

const UnifiedTransactionMetadata = z.object({
  source: z.string(),
});

const UnifiedTransaction = z.object({
  id: z.string(),
  created: z.string(),
  description: z.string(),
  amount: UnifiedTransactionAmount,
  type: z.enum(['DEBIT', 'CREDIT']),
  reference: z.string(),
  metadata: UnifiedTransactionMetadata,
});

type UnifiedTransaction = z.infer<typeof UnifiedTransaction>;

export default UnifiedTransaction;
