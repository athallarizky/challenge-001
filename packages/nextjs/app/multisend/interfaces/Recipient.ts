export type TransactionStatus = "pending" | "success" | "error";

export interface IRecipient {
  id: number;
  address: string;
  amount: string;
  error?: string;
  txStatus?: TransactionStatus;
}
