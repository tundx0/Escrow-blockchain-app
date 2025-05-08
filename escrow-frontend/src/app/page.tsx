"use client";

import React, { useState, useEffect } from "react";
import { EscrowList } from "../components/EscrowList";
import { CreateEscrowModal } from "../components/CreateEscrowModal";
import { motion } from "framer-motion";
import { useWeb3 } from "@/lib/hooks/useWeb3";
import { useEscrowStore } from "@/stores/escrowStore";

export default function Home() {
  // const { account } = useWeb3();
  const { fetchEscrows, escrows, loading, error, account } = useEscrowStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    if (account) {
      fetchEscrows();
    }
  }, [account, fetchEscrows]);

  return (
    <div className="container mx-auto px-4 py-8">
      {!account ? (
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
              className="bg-indigo-600 text-white px-4 py-2 rounded font-bold"
            >
              Create Escrow
            </motion.button>
          </div>

          {loading ? (
            <p>Loading escrows...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
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
