"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Divider, Heading, Text } from "@/components/ui";
import { useWeb3 } from "@/lib/hooks/useWeb3";
import { useEscrowStore } from "@/stores/escrowStore";
import { Escrow } from "@/types";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

const EscrowPage = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { account } = useEscrowStore();
  const {
    escrows,
    loading: storeLoading,
    error: storeError,
    fetchEscrows,
    fundEscrow,
    renderService,
    releaseFunds,
    openDispute,
  } = useEscrowStore();

  const [escrow, setEscrow] = useState<Escrow | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEscrow = async () => {
      if (!escrows.length) {
        await fetchEscrows();
      }
      if (escrows.length && id) {
        const foundEscrow = escrows.find((esc) => esc.id === Number(id));
        setEscrow(foundEscrow);
        setLoading(false);
      }
    };
    loadEscrow();
  }, [escrows, id, fetchEscrows]);

  const handleAction = async (action: string) => {
    if (!escrow) return;

    try {
      switch (action) {
        case "fund":
          await fundEscrow(escrow.id);
          break;
        case "renderService":
          await renderService(escrow.id);
          break;
        case "releaseFunds":
          await releaseFunds(escrow.id);
          break;
        case "openDispute":
          await openDispute(escrow.id);
          break;
        default:
          return;
      }
      toast.success(`Action ${action} completed successfully`);
      await fetchEscrows(); // Refresh escrows after action
      router.refresh();
    } catch (error) {
      console.error("Transaction failed:", error);
      toast.error(`Failed to ${action}: ${(error as Error).message}`);
    }
  };

  if (loading || storeLoading) return <div>Loading...</div>;
  if (storeError) return <div>Error: {storeError}</div>;
  if (!escrow) return <div>Escrow not found</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto p-4">
        <Heading size="lg">Escrow #{escrow.id}</Heading>
        <Divider />
        <div className="mt-4">
          <Text>
            <strong>Seller:</strong> {escrow.seller.slice(0, 6)}...
            {escrow.seller.slice(-4)}
          </Text>
          <Text>
            <strong>Buyer:</strong> {escrow.buyer.slice(0, 6)}...
            {escrow.buyer.slice(-4)}
          </Text>
          <Text>
            <strong>Amount:</strong> {escrow.amount} ETH
          </Text>
          <Text>
            <strong>Status:</strong> {escrow.status}
          </Text>
        </div>
        <Divider className="my-4" />
        <div className="flex flex-col space-y-4">
          {escrow.status === "Created" && account === escrow.buyer && (
            <Button onClick={() => handleAction("fund")}>Fund Escrow</Button>
          )}
          {escrow.status === "Funded" && account === escrow.seller && (
            <Button onClick={() => handleAction("renderService")}>
              Render Service
            </Button>
          )}
          {escrow.status === "ServiceRendered" && account === escrow.buyer && (
            <Button onClick={() => handleAction("releaseFunds")}>
              Release Funds
            </Button>
          )}
          {escrow.status === "ServiceRendered" && (
            <Button onClick={() => handleAction("openDispute")}>
              Open Dispute
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EscrowPage;
