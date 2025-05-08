import React from "react";
import { Escrow } from "@/types";

interface EscrowListProps {
  escrows: Escrow[];
  isAdmin?: boolean;
  onSettleDispute?: (escrowId: number, winner: string) => Promise<void>;
}

export const AdminEscrowList: React.FC<EscrowListProps> = ({
  escrows,
  isAdmin = false,
  onSettleDispute,
}) => {
  return (
    <div className="space-y-4">
      {escrows.map((escrow) => (
        <div key={escrow.id} className="border p-4 rounded">
          <h3 className="font-bold">Escrow #{escrow.id}</h3>
          <p>Seller: {escrow.seller}</p>
          <p>Buyer: {escrow.buyer}</p>
          <p>Amount: {escrow.amount} ETH</p>
          <p>Status: {escrow.status}</p>
          {isAdmin && escrow.status === "Disputed" && onSettleDispute && (
            <div className="mt-2">
              <button
                onClick={() => onSettleDispute(escrow.id, escrow.seller)}
                className="bg-green-500 text-white px-2 py-1 rounded mr-2"
              >
                Settle for Seller
              </button>
              <button
                onClick={() => onSettleDispute(escrow.id, escrow.buyer)}
                className="bg-blue-500 text-white px-2 py-1 rounded"
              >
                Settle for Buyer
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
