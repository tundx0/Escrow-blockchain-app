"use client";

import React, { useState } from "react";
import { EscrowList } from "../components/EscrowList";
import { CreateEscrowModal } from "../components/CreateEscrowModal";
import { motion } from "framer-motion";
import { useWeb3Context } from "@/contexts/Web3Context";

export default function Home() {
  const { account, provider } = useWeb3Context();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div>
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
          {provider && account && (
            <EscrowList provider={provider} account={account} />
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
