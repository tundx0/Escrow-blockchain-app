import { useReadEscrowEscrowCount, escrowAbi } from "@/lib/generated";
import { CONTRACT_ADDRESS } from "@/constants";
import { useReadContracts } from "wagmi";
import { formatEther } from "viem";
import { Escrow } from "@/types";

export function useEscrows() {
  const {
    data: count,
    refetch: refetchCount,
    isLoading: isLoadingCount,
  } = useReadEscrowEscrowCount({
    address: CONTRACT_ADDRESS as `0x${string}`,
  });

  const countNumber = count ? Number(count) : 0;

  // Build contract read requests for each escrow index (1-based index)
  const contracts = Array.from({ length: countNumber }, (_, i) => ({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: escrowAbi,
    functionName: "escrows",
    args: [BigInt(i + 1)],
  }));

  const {
    data: escrowsData,
    refetch: refetchEscrows,
    isLoading: isLoadingEscrows,
  } = useReadContracts({
    contracts,
    query: {
      enabled: countNumber > 0,
    },
  });

  const escrows: Escrow[] = [];
  if (escrowsData) {
    escrowsData.forEach((res, index) => {
      if (res.status === "success" && res.result) {
        const [buyer, seller, amount, status] = res.result as unknown as [
          string,
          string,
          bigint,
          number
        ];
        escrows.push({
          id: index + 1,
          buyer,
          seller,
          amount: formatEther(amount),
          status: [
            "Created",
            "Funded",
            "ServiceRendered",
            "Completed",
            "Disputed",
          ][status] as Escrow["status"],
        });
      }
    });
  }

  const refetch = async () => {
    await refetchCount();
    if (countNumber > 0) {
      await refetchEscrows();
    }
  };

  return {
    escrows,
    isLoading: isLoadingCount || isLoadingEscrows,
    refetch,
  };
}
