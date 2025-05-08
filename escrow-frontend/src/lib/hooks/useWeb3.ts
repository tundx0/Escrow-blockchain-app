"use client";

import { useState, useCallback, useEffect } from "react";
import { useEscrowStore } from "@/stores/escrowStore";
import web3Service from "@/lib/services/web3Service";

export function useWeb3() {
  const [loading, setLoading] = useState<boolean>(false);
  const { setAccount, account, provider, setProvider } = useEscrowStore();

  const checkIfConnected = useCallback(async () => {
    try {
      const provider = web3Service.getProvider();
      if (provider) {
        setProvider(await provider);
        const accounts = await (await provider).listAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0].address);
        }
      }
    } catch (error) {
      console.error("Error checking connection:", error);
    }
  }, [setAccount]);

  const connectWallet = useCallback(async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        setLoading(true);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = web3Service.getProvider();
        if (provider) {
          const signer = await (await provider).getSigner();
          const account = await signer.getAddress();
          setAccount(account);
          await web3Service.getContract();
        }
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      } finally {
        setLoading(false);
      }
    } else {
      console.error("Ethereum object not found. Install MetaMask.");
    }
  }, [setAccount]);

  const disconnectWallet = useCallback(() => {
    setAccount(null);
  }, [setAccount]);

  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      } else {
        disconnectWallet();
      }
    };

    const handleDisconnect = () => {
      disconnectWallet();
    };

    if (window.ethereum && typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("disconnect", handleDisconnect);

      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("disconnect", handleDisconnect);
      };
    }
  }, [setAccount, disconnectWallet]);

  return {
    account,
    connectWallet,
    loading,
    disconnectWallet,
    checkIfConnected,
    provider,
  };
}
