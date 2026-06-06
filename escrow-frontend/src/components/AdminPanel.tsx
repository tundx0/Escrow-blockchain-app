"use client";

import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import {
  useReadEscrowAdmin,
  useWriteEscrowSettleDispute,
  useWatchEscrowEscrowSettledEvent,
} from "@/lib/generated";
import { CONTRACT_ADDRESS } from "@/constants";
import { useEscrows } from "@/lib/hooks/useEscrows";
import { AdminEscrowList } from "./AdminEscrowList";
import { toast } from "react-hot-toast";

export const AdminPanel: React.FC = () => {
  const { address: account, isConnected } = useAccount();
  const { data: adminAddress, isLoading: isLoadingAdmin } = useReadEscrowAdmin({
    address: CONTRACT_ADDRESS as `0x${string}`,
  });
  const { escrows, isLoading: isLoadingEscrows, refetch } = useEscrows();
  const { writeContractAsync: settleDispute } = useWriteEscrowSettleDispute();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useWatchEscrowEscrowSettledEvent({
    address: CONTRACT_ADDRESS as `0x${string}`,
    onLogs() {
      refetch();
    },
  });

  if (!mounted) {
    return (
      <div className="text-center py-8">Checking admin credentials...</div>
    );
  }

  const isAdmin =
    account &&
    adminAddress &&
    account.toLowerCase() === adminAddress.toLowerCase();

  if (!isConnected || !account) {
    return (
      <div className="bg-slate-950/40 border border-slate-800/80 backdrop-blur-md p-8 rounded-2xl shadow-xl max-w-md mx-auto text-center">
        <h2 className="text-xl font-bold text-gray-100 mb-2">Access Denied</h2>
        <p className="text-gray-400">
          Please connect your wallet to access the admin panel.
        </p>
      </div>
    );
  }

  if (isLoadingAdmin || isLoadingEscrows) {
    return <div className="text-center py-8">Loading escrow data...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="bg-red-950/10 text-red-400 p-6 rounded-2xl max-w-md mx-auto text-center border border-red-500/20">
        <h2 className="text-xl font-bold mb-2">Unauthorized</h2>
        <p>You do not have administrative access to this system.</p>
      </div>
    );
  }

  const handleSettleDispute = async (escrowId: number, winner: string) => {
    const toastId = toast.loading(
      `Settling dispute for escrow #${escrowId}...`,
    );
    try {
      await settleDispute({
        address: CONTRACT_ADDRESS as `0x${string}`,
        args: [BigInt(escrowId), winner as `0x${string}`],
      });
      toast.success(`Dispute for escrow #${escrowId} settled successfully!`, {
        id: toastId,
      });
      refetch();
    } catch (error) {
      console.error("Failed to settle dispute:", error);
      toast.error(`Failed to settle dispute: ${(error as Error).message}`, {
        id: toastId,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-100 border-b border-slate-800 pb-4">
        Admin Panel
      </h1>
      <AdminEscrowList
        escrows={escrows}
        isAdmin={true}
        onSettleDispute={handleSettleDispute}
      />
    </div>
  );
};
