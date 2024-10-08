"use client";

import React from "react";
import { motion } from "framer-motion";
import { BrowserProvider } from "ethers";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Button,
  Heading,
  Text,
} from "@/components/ui";
import { useEscrowContext } from "@/contexts/EscrowContext";
import { useRouter } from "next/navigation"; // Ensure this import is correct

interface EscrowListProps {
  provider: BrowserProvider;
  account: string;
}

export const EscrowList: React.FC<EscrowListProps> = ({ account }) => {
  const { escrows } = useEscrowContext();
  const router = useRouter();

  const relatedEscrows = escrows.filter(
    (escrow) => escrow.buyer === account || escrow.seller === account
  );

  const handleViewDetails = (id: number) => {
    router.push(`/escrow/${id}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {relatedEscrows.map((escrow, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card>
            <CardHeader>
              <Heading size="sm">Escrow #{escrow.id}</Heading>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-2">
                <Text>Seller:</Text>
                <Text>
                  {escrow.seller.slice(0, 6)}...{escrow.seller.slice(-4)}
                </Text>
              </div>
              <div className="flex justify-between items-center mb-2">
                <Text>Buyer:</Text>
                <Text>
                  {escrow.buyer.slice(0, 6)}...{escrow.buyer.slice(-4)}
                </Text>
              </div>
              <div className="flex justify-between items-center mb-2">
                <Text>Amount:</Text>
                <Text>{escrow.amount} ETH</Text>
              </div>
              <div className="flex justify-between items-center">
                <Text>Status:</Text>
                <Text>{escrow.status}</Text>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleViewDetails(escrow.id)}
                variant="primary"
              >
                View Details
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
