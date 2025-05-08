"use client";

import React, { useEffect, useState } from "react";
import { useWeb3 } from "@/lib/hooks/useWeb3";
import { useEscrowStore } from "@/stores/escrowStore";
import { EscrowList } from "./EscrowList";
import { toast } from "react-hot-toast";
import { AdminEscrowList } from "./AdminEscrowList";

export const AdminPanel: React.FC = () => {
  const {
    escrows,
    loading,
    error,
    fetchEscrows,
    isAdmin,
    checkAdminStatus,
    settleDispute,
    account,
  } = useEscrowStore();
  const { connectWallet } = useWeb3();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const init = async () => {
      setIsChecking(true);
      if (account) {
        await checkAdminStatus();
        await fetchEscrows();
      }
      setIsChecking(false);
    };

    init();
  }, [account, checkAdminStatus, fetchEscrows]);

  if (isChecking) {
    return <div>Checking admin status...</div>;
  }

  if (!account) {
    return (
      <div>
        <p>Please connect your wallet to access the admin panel.</p>
        <button
          onClick={connectWallet}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  if (!isAdmin) {
    return <div>You do not have admin access.</div>;
  }

  if (loading) {
    return <div>Loading escrows...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleSettleDispute = async (escrowId: number, winner: string) => {
    try {
      await settleDispute(escrowId, winner);
      toast.success(`Dispute for escrow #${escrowId} settled successfully`);
    } catch (error) {
      toast.error(`Failed to settle dispute: ${(error as Error).message}`);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <AdminEscrowList
        escrows={escrows}
        isAdmin={true}
        onSettleDispute={handleSettleDispute}
      />
    </div>
  );
};
