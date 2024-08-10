"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EscrowForm } from "./EscrowForm";
import { useWeb3Context } from "@/contexts/Web3Context";

type CreateEscrowModalType = {
  isOpen: boolean;
  onClose: () => void;
};

export const CreateEscrowModal: React.FC<CreateEscrowModalType> = ({
  isOpen,
  onClose,
}) => {
  const { provider } = useWeb3Context();
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <h2 className="text-2xl font-bold mb-4">Create New Escrow</h2>
            {provider ? (
              <EscrowForm provider={provider} onComplete={onClose} />
            ) : (
              ""
            )}
            <button
              onClick={onClose}
              className="mt-4 bg-gray-200 text-gray-800 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
