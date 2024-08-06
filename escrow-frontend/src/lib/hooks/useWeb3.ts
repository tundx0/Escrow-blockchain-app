import { useState, useEffect } from "react";
import { BrowserProvider } from "ethers";

export function useWeb3() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    const connectWallet = async () => {
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
    };

    connectWallet();
  }, []);

  return { provider, account };
}
