import { z } from 'zod';

const RevolutTransactionAmount = z.object({
  value: z.string(),
  currency: z.string(),
});

const RevolutTransactionCounterparty = z.object({
  id: z.string(),
  name: z.string(),
});

const RevolutTransaction = z.object({
  id: z.string(),
  created_at: z.coerce.date(),
  completed_at: z.coerce.date(),
  state: z.string(),
  amount: RevolutTransactionAmount,
  merchant: z.string().nullable(),
  counterparty: RevolutTransactionCounterparty,
  reference: z.string(),
});

type RevolutTransaction = z.infer<typeof RevolutTransaction>;

export default RevolutTransaction;
