import { z } from 'zod';

const SterlingTransaction = z.object({
  id: z.string(),
  currency: z.string(),
  amount: z.string(),
  direction: z.string(),
  narrative: z.string(),
  created: z.coerce.date(),
  reference: z.string(),
});

type SterlingTransaction = z.infer<typeof SterlingTransaction>;

export default SterlingTransaction;
