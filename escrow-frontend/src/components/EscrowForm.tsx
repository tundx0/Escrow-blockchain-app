import { useEscrowContract } from "../lib/hooks/useEscrowContract";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BrowserProvider, ethers } from "ethers";

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

interface EscrowFormType {
  provider: BrowserProvider;
  onComplete: () => void;
}

type EscrowFormValues = z.infer<typeof escrowSchema>;

export const EscrowForm: React.FC<EscrowFormType> = ({
  provider,
  onComplete,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EscrowFormValues>({
    resolver: zodResolver(escrowSchema),
  });
  const contract = useEscrowContract(provider);

  const onSubmit = async (data: EscrowFormValues) => {
    if (contract) {
      try {
        const tx = await contract?.contract?.createEscrow(data.seller, {
          value: ethers.parseEther(data.amount),
        });
        await tx.wait();
        console.log("Escrow created successfully");
      } catch (error) {
        console.error("Error creating escrow:", error);
      }
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
