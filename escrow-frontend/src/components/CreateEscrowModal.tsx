"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EscrowForm } from "./EscrowForm";
import { useAccount } from "wagmi";

type CreateEscrowModalType = {
  isOpen: boolean;
  onClose: () => void;
};

export const CreateEscrowModal: React.FC<CreateEscrowModalType> = ({
  isOpen,
  onClose,
}) => {
  const { isConnected } = useAccount();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl relative"
          >
            <h2 className="text-2xl font-bold mb-4">Create New Escrow</h2>
            {isConnected ? (
              <EscrowForm onComplete={onClose} />
            ) : (
              <p className="text-red-500 font-medium">
                Please connect your wallet to create an escrow.
              </p>
            )}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-lg cursor-pointer"
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
