"use client";

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

  // Normalize address comparisons
  const relatedEscrows = escrows.filter(
    (escrow) =>
      escrow.buyer.toLowerCase() === account.toLowerCase() ||
      escrow.seller.toLowerCase() === account.toLowerCase()
  );

  const handleViewDetails = (id: number) => {
    router.push(`/escrow/${id}`);
  };

  if (relatedEscrows.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center max-w-lg mx-auto mt-8">
        <div className="text-gray-300 text-5xl mb-4">🔐</div>
        <h3 className="text-xl font-bold text-gray-700 mb-1">No Escrows Yet</h3>
        <p className="text-gray-500">
          You are not currently a participant in any escrow transactions. Click
          the button above to create one.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {relatedEscrows.map((escrow) => {
        const isBuyer = escrow.buyer.toLowerCase() === account.toLowerCase();
        return (
          <motion.div
            key={escrow.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition duration-300"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Escrow #{escrow.id}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    escrow.status === "Completed"
                      ? "bg-green-100 text-green-800"
                      : escrow.status === "Disputed"
                      ? "bg-red-100 text-red-800"
                      : "bg-indigo-100 text-indigo-800"
                  }`}
                >
                  {escrow.status}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-6">
                <div className="flex items-center justify-between">
                  <span>Role:</span>
                  <span className="font-semibold text-gray-700">
                    {isBuyer ? "Buyer" : "Seller"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Seller:</span>
                  <span className="font-mono text-xs">
                    {escrow.seller.slice(0, 6)}...{escrow.seller.slice(-4)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Buyer:</span>
                  <span className="font-mono text-xs">
                    {escrow.buyer.slice(0, 6)}...{escrow.buyer.slice(-4)}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 block uppercase tracking-wider">
                  Amount
                </span>
                <span className="text-lg font-bold text-indigo-600">
                  {escrow.amount} ETH
                </span>
              </div>
              <button
                onClick={() => handleViewDetails(escrow.id)}
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold px-4 py-2 rounded-lg text-sm transition duration-300 cursor-pointer"
              >
                Details
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
