"use client";

import { useState, useCallback, useEffect } from "react";
import { BrowserProvider } from "ethers";

export function useWeb3() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Initialize provider and account from localStorage
    const storedAccount = localStorage.getItem("account");
    if (storedAccount) {
      setAccount(storedAccount);
      if (window.ethereum) {
        const ethProvider = new BrowserProvider(window.ethereum);
        setProvider(ethProvider);
      }
    }
  }, []);

  const connectWallet = useCallback(async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        setLoading(true);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const account = await signer.getAddress();
        setProvider(provider);
        setAccount(account);
        localStorage.setItem("account", account);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      } finally {
        setLoading(false);
      }
    } else {
      console.error("Ethereum object not found. Install MetaMask.");
    }
  }, []);

  const disconnectWallet = () => {
    setProvider(null);
    setAccount(null);
    localStorage.removeItem("account");
  };

  return { provider, account, connectWallet, loading, disconnectWallet };
}
