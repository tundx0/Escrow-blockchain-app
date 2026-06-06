"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWriteEscrowCreateEscrow } from "@/lib/generated";
import { CONTRACT_ADDRESS } from "@/constants";
import { parseEther } from "viem";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useConfig } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";

const escrowSchema = z.object({
  seller: z
    .string()
    .min(1, "Seller address is required")
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .regex(/^\d*\.?\d+$/, "Invalid amount"),
});

type EscrowFormValues = z.infer<typeof escrowSchema>;

interface EscrowFormProps {
  onComplete: () => void;
}

export const EscrowForm: React.FC<EscrowFormProps> = ({ onComplete }) => {
  const router = useRouter();
  const config = useConfig();
  const { writeContractAsync: createEscrow, isPending } =
    useWriteEscrowCreateEscrow();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EscrowFormValues>({
    resolver: zodResolver(escrowSchema),
  });

  const onSubmit = async (data: EscrowFormValues) => {
    const toastId = toast.loading("Creating escrow...");
    try {
      const hash = await createEscrow({
        address: CONTRACT_ADDRESS as `0x${string}`,
        args: [data.seller as `0x${string}`],
        value: parseEther(data.amount),
      });

      toast.loading("Waiting for confirmations...", { id: toastId });
      const receipt = await waitForTransactionReceipt(config, { hash });

      // In Escrow.sol: event EscrowCreated(uint256 indexed escrowId, address buyer, address seller, uint256 amount)
      // The escrowId is the first indexed argument, which is located in topics[1] of the log
      const topic = receipt.logs[0]?.topics[1];
      if (topic) {
        const newId = Number(BigInt(topic));
        toast.success("Escrow created successfully", { id: toastId });
        reset();
        onComplete();
        router.push(`/escrow/${newId}`);
      } else {
        toast.success("Escrow created successfully", { id: toastId });
        reset();
        onComplete();
      }
    } catch (error) {
      console.error("Error creating escrow:", error);
      toast.error(`Failed to create escrow: ${(error as Error).message}`, {
        id: toastId,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-md"
    >
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">
          Seller Address
        </label>
        <input
          type="text"
          {...register("seller")}
          disabled={isPending}
          className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.seller ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="0x..."
        />
        {errors.seller && (
          <p className="text-red-500 text-sm mt-1">{errors.seller.message}</p>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">
          Amount in ETH
        </label>
        <input
          type="text"
          {...register("amount")}
          disabled={isPending}
          className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.amount ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="0.0"
        />
        {errors.amount && (
          <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="w-full px-4 py-2 bg-indigo-600 text-white font-bold rounded hover:bg-indigo-700 transition duration-300 disabled:bg-indigo-400 cursor-pointer"
      >
        {isPending ? "Creating..." : "Create Escrow"}
      </button>
    </form>
  );
};
