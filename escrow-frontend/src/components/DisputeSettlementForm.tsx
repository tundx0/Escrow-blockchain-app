import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEscrowStore } from "@/stores/escrowStore";
import { ethers } from "ethers";

// Define the schema for form validation
const schema = z.object({
  winner: z
    .string()
    .min(1, "Winner's address is required")
    .refine((value) => ethers.isAddress(value), {
      message: "Invalid Ethereum address",
    }),
});

type FormData = z.infer<typeof schema>;

interface DisputeSettlementFormProps {
  escrowId: number;
}

const DisputeSettlementForm: React.FC<DisputeSettlementFormProps> = ({
  escrowId,
}) => {
  const { settleDispute, isAdmin } = useEscrowStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    if (!isAdmin) {
      setError("winner", {
        type: "manual",
        message: "Only admin can settle disputes",
      });
      return;
    }
    try {
      await settleDispute(escrowId, data.winner);
    } catch (error) {
      setError("winner", { type: "manual", message: (error as Error).message });
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="winner">Winner's Address:</label>
        <input
          id="winner"
          {...register("winner")}
          placeholder="Enter winner's address"
        />
        {errors.winner && <p className="error">{errors.winner.message}</p>}
      </div>
      <button type="submit">Settle Dispute</button>
    </form>
  );
};

export default DisputeSettlementForm;
