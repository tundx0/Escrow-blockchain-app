"use client";
import React, { createContext, useContext } from "react";
import { useEscrowContract } from "../lib/hooks/useEscrowContract";
import { BrowserProvider, ethers } from "ethers";
import { EscrowContextType } from "@/types";
import { useWeb3Context } from "./Web3Context";

const EscrowContext = createContext<EscrowContextType | undefined>(undefined);

export const EscrowProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { provider } = useWeb3Context();
  const { contract, escrows, loading } = useEscrowContract(provider);

  return (
    <EscrowContext.Provider value={{ contract, escrows, loading }}>
      {children}
    </EscrowContext.Provider>
  );
};

export const useEscrowContext = () => {
  const context = useContext(EscrowContext);
  if (!context) {
    throw new Error("useEscrowContext must be used within an EscrowProvider");
  }
  return context;
};
