interface revolutTransactionAmount {
  value: number;
  currency: string;
}

interface revolutTransactionCounterparty {
  id: string;
  name: string;
}

interface revolutTransaction {
  id: string;
  created_at: string;
  completed_at: string;
  state: string;
  amount: revolutTransactionAmount;
  merchant: string;
  counterparty: revolutTransactionCounterparty;
  reference: string;
}

export default revolutTransaction;
