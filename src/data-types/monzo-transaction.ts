import { z } from 'zod';

const MonzoTransactionMetadata = z.object({
  reference: z.string(),
});

const MonzoTransaction = z.object({
  id: z.string(),
  created: z.coerce.date(),
  description: z.string(),
  amount: z.number(),
  currency: z.string(),
  metadata: MonzoTransactionMetadata,
});

type MonzoTransaction = z.infer<typeof MonzoTransaction>;

export default MonzoTransaction;
