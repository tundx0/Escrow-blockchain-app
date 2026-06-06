import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAccount } from "wagmi";
import {
  useWriteEscrowSettleDispute,
  useReadEscrowAdmin,
} from "@/lib/generated";
import { CONTRACT_ADDRESS } from "@/constants";
import { isAddress } from "viem";
import { toast } from "react-hot-toast";

const schema = z.object({
  winner: z
    .string()
    .min(1, "Winner's address is required")
    .refine((value) => isAddress(value), {
      message: "Invalid Ethereum address",
    }),
});

type FormData = z.infer<typeof schema>;

interface DisputeSettlementFormProps {
  escrowId: number;
  onSuccess?: () => void;
}

const DisputeSettlementForm: React.FC<DisputeSettlementFormProps> = ({
  escrowId,
  onSuccess,
}) => {
  const { address: account } = useAccount();
  const { data: adminAddress } = useReadEscrowAdmin({
    address: CONTRACT_ADDRESS as `0x${string}`,
  });
  const { writeContractAsync: settleDispute, isPending } =
    useWriteEscrowSettleDispute();

  const isAdmin =
    account &&
    adminAddress &&
    account.toLowerCase() === adminAddress.toLowerCase();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    if (!isAdmin) {
      toast.error("Only admin can settle disputes");
      return;
    }
    const toastId = toast.loading("Settling dispute...");
    try {
      await settleDispute({
        address: CONTRACT_ADDRESS as `0x${string}`,
        args: [BigInt(escrowId), data.winner as `0x${string}`],
      });
      toast.success("Dispute settled successfully", { id: toastId });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Failed to settle dispute:", error);
      toast.error(`Failed to settle dispute: ${(error as Error).message}`, {
        id: toastId,
      });
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
      <div>
        <label
          htmlFor="winner"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Winner's Address:
        </label>
        <input
          id="winner"
          {...register("winner")}
          disabled={isPending}
          placeholder="0x..."
          className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.winner ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.winner && (
          <p className="text-red-500 text-sm mt-1">{errors.winner.message}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-300 disabled:bg-indigo-400 cursor-pointer"
      >
        {isPending ? "Settling..." : "Settle Dispute"}
      </button>
    </form>
  );
};

export default DisputeSettlementForm;
