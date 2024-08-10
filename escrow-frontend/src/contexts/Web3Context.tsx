"use client";

import React, { createContext, useContext } from "react";
import { useWeb3 } from "../lib/hooks/useWeb3";
import { Web3ContextType } from "@/types";

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { provider, account, loading, connectWallet, disconnectWallet } =
    useWeb3();

  return (
    <Web3Context.Provider
      value={{ provider, account, loading, connectWallet, disconnectWallet }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3Context = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3Context must be used within a Web3Provider");
  }
  return context;
};
