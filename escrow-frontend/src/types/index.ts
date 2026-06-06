export interface Escrow {
  id: number;
  buyer: string;
  seller: string;
  amount: string;
  status: "Created" | "Funded" | "ServiceRendered" | "Completed" | "Disputed";
}
