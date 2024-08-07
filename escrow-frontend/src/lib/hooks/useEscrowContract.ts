import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import EscrowABI from "../contracts/Escrow.json";
import { BrowserProvider } from "ethers";

const CONTRACT_ADDRESS = "0xf5Ad1eE4c9f641A1F7dcdc926A1D5C6C7b6aCc10"; // Your deployed contract address

interface Escrow {
  id: number;
  buyer: string;
  seller: string;
  amount: string;
  status: string;
}

export function useEscrowContract(provider: BrowserProvider | null) {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [escrows, setEscrows] = useState<Escrow[]>([]);

  const initializeContract = useCallback(async () => {
    if (provider) {
      try {
        const signer = await provider.getSigner();
        const escrowContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          EscrowABI.abi,
          signer
        );
        setContract(escrowContract);
      } catch (error) {
        console.error("Error initializing contract:", error);
      }
    }
  }, [provider]);

  const fetchEscrows = useCallback(async () => {
    if (contract) {
      try {
        const escrowCount = await contract.escrowCount();
        const fetchedEscrows: Escrow[] = [];
        for (let i = 1; i <= escrowCount; i++) {
          const escrow = await contract.escrows(i);
          fetchedEscrows.push({
            id: i,
            buyer: escrow.buyer,
            seller: escrow.seller,
            amount: ethers.formatEther(escrow.amount),
            status: [
              "Created",
              "Funded",
              "ServiceRendered",
              "Completed",
              "Disputed",
            ][escrow.status],
          });
        }
        setEscrows(fetchedEscrows);
      } catch (error) {
        console.error("Error fetching escrows:", error);
      }
    }
  }, [contract]);

  useEffect(() => {
    initializeContract();
  }, [initializeContract]);

  useEffect(() => {
    fetchEscrows();
  }, [contract, fetchEscrows]);

  return { contract, escrows };
}
