"use client";

import React, { useState, useEffect } from "react";
import { EscrowList } from "../components/EscrowList";
import { CreateEscrowModal } from "../components/CreateEscrowModal";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import { useEscrows } from "@/lib/hooks/useEscrows";
import { useWatchEscrowEscrowCreatedEvent } from "@/lib/generated";
import { CONTRACT_ADDRESS } from "@/constants";

export default function Home() {
  const { address: account, isConnected } = useAccount();
  const { escrows, isLoading, refetch } = useEscrows();
  const [mounted, setMounted] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-refetch escrows when events are fired
  useWatchEscrowEscrowCreatedEvent({
    address: CONTRACT_ADDRESS as `0x${string}`,
    onLogs() {
      refetch();
    },
  });

  if (!mounted) {
    return (
      <div className="text-center py-12 text-slate-400">
        Loading escrows...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {!isConnected || !account ? (
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to SecureEscrow</h1>
          <p className="text-xl mb-8">Connect your wallet to get started</p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Your Escrows</h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded font-bold cursor-pointer"
            >
              Create Escrow
            </motion.button>
          </div>

          {isLoading ? (
            <p>Loading escrows...</p>
          ) : (
            <EscrowList escrows={escrows} account={account} />
          )}
        </>
      )}

      <CreateEscrowModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
