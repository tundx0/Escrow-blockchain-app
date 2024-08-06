import { useState, useEffect } from "react";
import { ethers, BrowserProvider } from "ethers";
import EscrowABI from "../contracts/Escrow.json";

const CONTRACT_ADDRESS = "0x..."; // Your deployed contract address

export function useEscrowContract(provider: BrowserProvider | null) {
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    if (provider) {
      const escrowContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        EscrowABI,
        provider.getSigner()
      );
      setContract(escrowContract);
    }
  }, [provider]);

  return contract;
}
