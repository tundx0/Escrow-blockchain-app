"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Divider, Heading, Text } from "@/components/ui";
import { useAccount } from "wagmi";
import {
  useReadEscrowEscrows,
  useReadEscrowAdmin,
  useWriteEscrowFundEscrow,
  useWriteEscrowRenderService,
  useWriteEscrowReleaseFunds,
  useWriteEscrowOpenDispute,
  useWatchEscrowEscrowFundedEvent,
  useWatchEscrowServiceRenderedEvent,
  useWatchEscrowEscrowCompletedEvent,
  useWatchEscrowEscrowDisputedEvent,
  useWatchEscrowEscrowSettledEvent,
} from "@/lib/generated";
import { CONTRACT_ADDRESS } from "@/constants";
import { formatEther } from "viem";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { QRCodeSVG } from "qrcode.react";
import { EscrowChat } from "@/components/EscrowChat";

const STATUS_MAP = [
  "Created",
  "Funded",
  "ServiceRendered",
  "Completed",
  "Disputed",
] as const;

const EscrowPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { address: account } = useAccount();

  const escrowId = BigInt(id || "0");
  const [copiedText, setCopiedText] = useState<"uri" | "address" | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Read escrow info from contract
  const {
    data: escrowData,
    isLoading: isReading,
    error: readError,
    refetch: refetchEscrow,
  } = useReadEscrowEscrows({
    address: CONTRACT_ADDRESS as `0x${string}`,
    args: [escrowId],
    query: {
      enabled: !!id,
    },
  });

  // Read admin address
  const { data: adminAddress } = useReadEscrowAdmin({
    address: CONTRACT_ADDRESS as `0x${string}`,
  });

  // Watch events for live updates
  const eventConfig = {
    address: CONTRACT_ADDRESS as `0x${string}`,
    onLogs() {
      refetchEscrow();
    },
  };

  useWatchEscrowEscrowFundedEvent(eventConfig);
  useWatchEscrowServiceRenderedEvent(eventConfig);
  useWatchEscrowEscrowCompletedEvent(eventConfig);
  useWatchEscrowEscrowDisputedEvent(eventConfig);
  useWatchEscrowEscrowSettledEvent(eventConfig);

  // Write hooks
  const { writeContractAsync: fundEscrow, isPending: isFunding } =
    useWriteEscrowFundEscrow();
  const { writeContractAsync: renderService, isPending: isRendering } =
    useWriteEscrowRenderService();
  const { writeContractAsync: releaseFunds, isPending: isReleasing } =
    useWriteEscrowReleaseFunds();
  const { writeContractAsync: openDispute, isPending: isDisputing } =
    useWriteEscrowOpenDispute();

  const isPending = isFunding || isRendering || isReleasing || isDisputing;

  const handleAction = async (action: string) => {
    if (!id) return;
    const toastId = toast.loading(`${action} in progress...`);

    try {
      switch (action) {
        case "fund":
          await fundEscrow({
            address: CONTRACT_ADDRESS as `0x${string}`,
            args: [escrowId],
          });
          break;
        case "renderService":
          await renderService({
            address: CONTRACT_ADDRESS as `0x${string}`,
            args: [escrowId],
          });
          break;
        case "releaseFunds":
          await releaseFunds({
            address: CONTRACT_ADDRESS as `0x${string}`,
            args: [escrowId],
          });
          break;
        case "openDispute":
          await openDispute({
            address: CONTRACT_ADDRESS as `0x${string}`,
            args: [escrowId],
          });
          break;
        default:
          return;
      }
      toast.success(`${action} completed successfully`, { id: toastId });
      refetchEscrow();
    } catch (error) {
      console.error("Transaction failed:", error);
      toast.error(`Transaction failed: ${(error as Error).message}`, {
        id: toastId,
      });
    }
  };

  const copyToClipboard = (text: string, type: "uri" | "address") => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedText(null), 2000);
  };

  if (!mounted) {
    return (
      <div className="text-center py-12 text-slate-400">
        Loading escrow view...
      </div>
    );
  }

  if (isReading) return <div className="text-center py-12">Loading...</div>;
  if (readError || !escrowData) {
    return (
      <div className="text-center py-12 text-red-500 font-semibold">
        Escrow not found
      </div>
    );
  }

  const [buyer, seller, amount, statusNum] = escrowData;
  const status = STATUS_MAP[statusNum] || "Unknown";

  // Hide page if escrow is empty/uninitialized
  if (buyer === "0x0000000000000000000000000000000000000000") {
    return (
      <div className="text-center py-12 text-red-500 font-semibold">
        Escrow not found
      </div>
    );
  }

  const isBuyer = account?.toLowerCase() === buyer.toLowerCase();
  const isSeller = account?.toLowerCase() === seller.toLowerCase();

  // payment URI standard ERC-681
  const paymentUri = `ethereum:${CONTRACT_ADDRESS}/fundEscrow?uint256=${id}`;

  return (
    <div className="max-w-4xl mx-auto space-y-8 mt-6">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Side: Escrow Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:col-span-3 bg-slate-950/40 border border-slate-800/80 backdrop-blur-md p-8 rounded-2xl shadow-xl space-y-6"
        >
          <div className="flex justify-between items-center">
            <Heading size="lg">Escrow #{id}</Heading>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                status === "Completed"
                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                  : status === "Disputed"
                  ? "bg-red-500/10 text-red-400 border border-red-500/20"
                  : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
              }`}
            >
              {status}
            </span>
          </div>
          <Divider />

          <div className="space-y-4">
            <div>
              <span className="text-gray-400 block text-xs uppercase tracking-wider mb-1">
                Seller Address
              </span>
              <Text>
                <strong className="text-gray-200 font-mono text-sm break-all">
                  {seller}
                </strong>
              </Text>
            </div>
            <div>
              <span className="text-gray-400 block text-xs uppercase tracking-wider mb-1">
                Buyer Address
              </span>
              <Text>
                <strong className="text-gray-200 font-mono text-sm break-all">
                  {buyer}
                </strong>
              </Text>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <span className="text-gray-400 block text-xs uppercase tracking-wider">
                  Amount
                </span>
                <span className="text-3xl font-extrabold text-indigo-400">
                  {formatEther(amount)} ETH
                </span>
              </div>
            </div>
          </div>

          <Divider />

          <div className="flex flex-col space-y-3">
            {status === "Created" && isBuyer && (
              <Button disabled={isPending} onClick={() => handleAction("fund")}>
                {isFunding ? "Funding..." : "Fund Escrow"}
              </Button>
            )}
            {status === "Funded" && isSeller && (
              <Button
                disabled={isPending}
                onClick={() => handleAction("renderService")}
              >
                {isRendering ? "Rendering Service..." : "Render Service"}
              </Button>
            )}
            {status === "ServiceRendered" && isBuyer && (
              <Button
                disabled={isPending}
                onClick={() => handleAction("releaseFunds")}
              >
                {isReleasing ? "Releasing..." : "Release Funds"}
              </Button>
            )}
            {status === "ServiceRendered" && (isBuyer || isSeller) && (
              <Button
                variant="secondary"
                disabled={isPending}
                onClick={() => handleAction("openDispute")}
              >
                {isDisputing ? "Opening Dispute..." : "Open Dispute"}
              </Button>
            )}
          </div>
        </motion.div>

        {/* Right Side: Bitrefill-style Payment Checkout Display / Confirmation */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="lg:col-span-2 bg-slate-950/40 border border-slate-800/80 backdrop-blur-md p-8 rounded-2xl shadow-xl flex flex-col items-center justify-between text-center min-h-[380px]"
        >
          {status === "Created" ? (
            <>
              <div className="w-full">
                <h3 className="font-bold text-gray-100 mb-2">
                  Awaiting Funding Confirmation
                </h3>
                <p className="text-gray-400 text-xs mb-6 leading-relaxed">
                  The escrow has been created. The buyer must confirm funding to
                  hold funds in the contract.
                </p>
              </div>

              {/* QR Code */}
              <div className="bg-white p-4 rounded-xl shadow-lg inline-block border border-slate-800">
                <QRCodeSVG value={paymentUri} size={150} />
              </div>

              {/* Checkout Details */}
              <div className="w-full mt-6 space-y-3">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">
                    Confirmation URI
                  </span>
                  <div className="flex bg-slate-900 border border-slate-800 rounded-xl overflow-hidden text-left items-center p-2">
                    <span className="text-xs text-gray-300 font-mono truncate flex-1 px-2 select-all">
                      {paymentUri}
                    </span>
                    <button
                      onClick={() => copyToClipboard(paymentUri, "uri")}
                      className="bg-indigo-600 hover:bg-indigo-500 transition px-3 py-1 rounded-lg text-xs text-white cursor-pointer font-semibold shrink-0"
                    >
                      {copiedText === "uri" ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center my-auto space-y-6">
              <div className="h-20 w-20 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center text-4xl shadow-lg shadow-emerald-500/5 animate-pulse">
                🛡️
              </div>
              <div>
                <h3 className="font-bold text-emerald-400 text-lg mb-1">
                  Escrow Fully Funded
                </h3>
                <p className="text-gray-400 text-xs max-w-xs leading-relaxed">
                  {formatEther(amount)} ETH is held securely in the smart
                  contract. The funds are locked until the buyer releases them
                  or a dispute is resolved.
                </p>
              </div>
              <div className="w-full text-left space-y-2 bg-slate-900/60 border border-slate-800/60 p-4 rounded-xl text-xs font-mono text-gray-300">
                <div className="flex justify-between">
                  <span className="text-gray-500">Contract:</span>
                  <span className="truncate w-32 text-right">
                    {CONTRACT_ADDRESS.slice(0, 6)}...
                    {CONTRACT_ADDRESS.slice(-4)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Security:</span>
                  <span className="text-emerald-400">On-Chain Verified</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Dynamic secure chat component */}
      {adminAddress && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <EscrowChat
            escrowId={Number(id)}
            buyer={buyer}
            seller={seller}
            admin={adminAddress}
          />
        </motion.div>
      )}
    </div>
  );
};

export default EscrowPage;
