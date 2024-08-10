"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Divider, Heading, Text } from "@/components/ui";
import { useWeb3Context } from "@/contexts/Web3Context";
import { useEscrowContext } from "@/contexts/EscrowContext";
import { Escrow } from "@/types";
import { motion } from "framer-motion";

const EscrowPage = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { account } = useWeb3Context();
  const { escrows, contract } = useEscrowContext();

  const [escrow, setEscrow] = useState<Escrow>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (escrows && id) {
      const foundEscrow = escrows.find((esc) => esc.id === Number(id));
      setEscrow(foundEscrow);
      setLoading(false);
    }
  }, [escrows, id]);

  const handleAction = async (action: string) => {
    if (!contract || !escrow) return;

    try {
      let tx;
      switch (action) {
        case "fund":
          tx = await contract.fundEscrow(escrow.id, { from: account });
          break;
        case "renderService":
          tx = await contract.renderService(escrow.id, { from: account });
          break;
        case "releaseFunds":
          tx = await contract.releaseFunds(escrow.id, { from: account });
          break;
        case "openDispute":
          tx = await contract.openDispute(escrow.id, { from: account });
          break;
        default:
          return;
      }
      await tx.wait();
      router.refresh();
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

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
