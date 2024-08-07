import { useState, useEffect, useCallback } from "react";
import { BrowserProvider } from "ethers";

export function useWeb3() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = useCallback(async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const account = await signer.getAddress();
        setProvider(provider);
        setAccount(account);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    }
  }, []);

  useEffect(() => {
    connectWallet();
  }, [connectWallet]);

  return { provider, account, connectWallet };
}
