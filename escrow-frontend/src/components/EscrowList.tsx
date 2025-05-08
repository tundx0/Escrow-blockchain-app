import React from "react";
import { motion } from "framer-motion";
import { Escrow } from "@/types";
import { useRouter } from "next/navigation";

interface EscrowListProps {
  escrows: Escrow[];
  account: string;
}

export const EscrowList: React.FC<EscrowListProps> = ({ escrows, account }) => {
  const router = useRouter();

  const relatedEscrows = escrows.filter(
    (escrow) => escrow.buyer === account || escrow.seller === account
  );

  const handleViewDetails = (id: number) => {
    router.push(`/escrow/${id}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {relatedEscrows.map((escrow) => (
        <motion.div
          key={escrow.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Escrow #{escrow.id}</h2>
            <p>
              Seller: {escrow.seller.slice(0, 6)}...{escrow.seller.slice(-4)}
            </p>
            <p>
              Buyer: {escrow.buyer.slice(0, 6)}...{escrow.buyer.slice(-4)}
            </p>
            <p>Amount: {escrow.amount} ETH</p>
            <p>Status: {escrow.status}</p>
            <button
              onClick={() => handleViewDetails(escrow.id)}
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded"
            >
              View Details
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
