import React from "react";
import { motion } from "framer-motion";
import { useEscrowContract } from "../lib/hooks/useEscrowContract";
import { BrowserProvider } from "ethers";

interface EscrowListType {
  provider: BrowserProvider;
}

export const EscrowList: React.FC<EscrowListType> = ({ provider }) => {
  const { escrows } = useEscrowContract(provider);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {escrows.map((escrow, index) => (
        <motion.div
          key={escrow.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg shadow p-4"
        >
          <h3 className="text-lg font-semibold mb-2">Escrow #{escrow.id}</h3>
          <p>
            Seller: {escrow.seller.slice(0, 6)}...{escrow.seller.slice(-4)}
          </p>
          <p>Amount: {escrow.amount} ETH</p>
          <p>Status: {escrow.status}</p>
        </motion.div>
      ))}
    </div>
  );
};
