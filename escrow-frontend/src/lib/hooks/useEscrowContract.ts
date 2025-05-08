import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { useEscrowStore } from "@/stores/escrowStore";
import web3Service from "@/lib/services/web3Service";
import { BigNumberish } from "ethers";

export const useEscrowContract = () => {
  const { addEscrow, updateEscrow } = useEscrowStore();
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  const initializeContract = useCallback(async () => {
    try {
      const contractInstance = await web3Service.getContract();
      setContract(contractInstance);
    } catch (error) {
      console.error("Failed to initialize contract:", error);
    }
  }, []);

  const initializeListeners = useCallback(() => {
    if (!contract) return;

    const handleEscrowCreated = (
      escrowId: BigNumberish,
      buyer: string,
      seller: string,
      amount: BigNumberish
    ) => {
      addEscrow({
        id: Number(escrowId),
        buyer,
        seller,
        amount: ethers.formatEther(amount),
        status: "Created",
      });
    };

    const handleEscrowUpdated = (
      escrowId: BigNumberish,
      status: "Funded" | "ServiceRendered" | "Completed" | "Disputed"
    ) => {
      updateEscrow({ id: Number(escrowId), status });
    };

    contract.on("EscrowCreated", handleEscrowCreated);
    contract.on("EscrowFunded", (escrowId) =>
      handleEscrowUpdated(escrowId.toNumber(), "Funded")
    );
    contract.on("ServiceRendered", (escrowId) =>
      handleEscrowUpdated(escrowId, "ServiceRendered")
    );
    contract.on("EscrowCompleted", (escrowId) =>
      handleEscrowUpdated(escrowId.toNumber(), "Completed")
    );
    contract.on("EscrowDisputed", (escrowId) =>
      handleEscrowUpdated(escrowId, "Disputed")
    );

    return () => {
      contract.removeAllListeners();
    };
  }, [contract, addEscrow, updateEscrow]);

  useEffect(() => {
    initializeContract();
  }, [initializeContract]);

  useEffect(() => {
    if (contract) {
      const cleanup = initializeListeners();
      return cleanup;
    }
  }, [contract, initializeListeners]);

  return { web3Service };
};
