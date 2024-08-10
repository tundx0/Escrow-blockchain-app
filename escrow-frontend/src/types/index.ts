import { BrowserProvider, ethers } from "ethers";

export interface Web3ContextType {
  provider: BrowserProvider | null;
  account: string | null;
  loading: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

export interface EscrowContextType {
  contract: ethers.Contract | null;
  escrows: Escrow[];
  loading: boolean;
}

export interface Escrow {
  id: number;
  buyer: string;
  seller: string;
  amount: string;
  status: string;
}
