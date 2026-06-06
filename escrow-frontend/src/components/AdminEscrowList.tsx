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
  const disputedEscrows = escrows.filter(
    (escrow) => escrow.status === "Disputed"
  );

  return (
    <div className="space-y-4">
      {disputedEscrows.length === 0 ? (
        <p className="text-gray-500 italic">No disputed escrows found.</p>
      ) : (
        disputedEscrows.map((escrow) => (
          <div
            key={escrow.id}
            className="border border-gray-200 bg-white shadow-sm p-6 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div>
              <h3 className="font-bold text-lg text-gray-800">
                Escrow #{escrow.id}
              </h3>
              <div className="mt-2 text-sm text-gray-600 space-y-1">
                <p>
                  <span className="font-medium">Seller:</span>{" "}
                  {escrow.seller.slice(0, 8)}...{escrow.seller.slice(-6)}
                </p>
                <p>
                  <span className="font-medium">Buyer:</span>{" "}
                  {escrow.buyer.slice(0, 8)}...{escrow.buyer.slice(-6)}
                </p>
                <p>
                  <span className="font-medium">Amount:</span> {escrow.amount}{" "}
                  ETH
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  <span className="text-red-500 font-semibold">
                    {escrow.status}
                  </span>
                </p>
              </div>
            </div>
            {isAdmin && escrow.status === "Disputed" && onSettleDispute && (
              <div className="flex md:flex-col gap-2 shrink-0 justify-end">
                <button
                  onClick={() => onSettleDispute(escrow.id, escrow.seller)}
                  className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded transition cursor-pointer"
                >
                  Settle for Seller
                </button>
                <button
                  onClick={() => onSettleDispute(escrow.id, escrow.buyer)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded transition cursor-pointer"
                >
                  Settle for Buyer
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};
