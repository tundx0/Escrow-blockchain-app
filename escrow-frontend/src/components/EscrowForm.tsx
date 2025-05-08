"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWeb3 } from "@/lib/hooks/useWeb3";
import { useEscrowStore } from "@/stores/escrowStore";
import { toast } from "react-hot-toast";

import web3Service from "@/lib/services/web3Service";
import { createEscrowContractService } from "@/lib/services/escrowContractService";

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
  const { provider } = useWeb3();
  const { addEscrow } = useEscrowStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EscrowFormValues>({
    resolver: zodResolver(escrowSchema),
  });

  const onSubmit = async (data: EscrowFormValues) => {
    if (!provider) {
      toast.error("Wallet not connected");
      return;
    }

    const contract = await web3Service.getContract();
    if (!contract) {
      toast.error("Contract not initialized");
      return;
    }

    const escrowService = createEscrowContractService(contract, provider);
    const newEscrow = await escrowService.createEscrow(
      data.seller,
      data.amount
    );

    if (newEscrow) {
      addEscrow(newEscrow);
      toast.success("Escrow created successfully");
      reset();
      onComplete();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-md"
    >
      <div className="mb-4">
        <label className="block text-gray-700">Seller Address</label>
        <input
          type="text"
          {...register("seller")}
          className={`w-full px-3 py-2 border rounded ${
            errors.seller ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Seller Address"
        />
        {errors.seller && (
          <p className="text-red-500 text-sm mt-1">{errors.seller.message}</p>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Amount in ETH</label>
        <input
          type="text"
          {...register("amount")}
          className={`w-full px-3 py-2 border rounded ${
            errors.amount ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Amount in ETH"
        />
        {errors.amount && (
          <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
        )}
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition duration-300"
      >
        Create Escrow
      </button>
    </form>
  );
};
