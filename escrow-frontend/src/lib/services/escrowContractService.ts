import { Contract, ethers } from "ethers";
import { toast } from "react-hot-toast";
import { Escrow } from "@/types";
import { BrowserProvider } from "ethers";

export class EscrowContractService {
  private contract: Contract;
  private provider: BrowserProvider;

  constructor(contract: Contract, provider: BrowserProvider) {
    this.contract = contract;
    this.provider = provider;
  }

  async createEscrow(seller: string, amount: string): Promise<Escrow | null> {
    try {
      const tx = await this.contract.createEscrow(seller, {
        value: ethers.parseEther(amount),
      });
      toast.loading("Creating escrow...");
      await tx.wait();

      const escrowId = await this.contract.escrowCount();
      const buyer = (await this.provider.getSigner()).address;

      toast.success("Escrow created successfully");
      return {
        id: escrowId.toNumber(),
        seller,
        buyer,
        amount,
        status: "Created",
      };
    } catch (error) {
      console.error("Error creating escrow:", error);
      toast.error("Failed to create escrow");
      return null;
    }
  }

  async fundEscrow(escrowId: number): Promise<boolean> {
    try {
      const tx = await this.contract.fundEscrow(escrowId);
      toast.loading("Funding escrow...");
      await tx.wait();
      toast.success("Escrow funded successfully");
      return true;
    } catch (error) {
      console.error("Error funding escrow:", error);
      toast.error("Failed to fund escrow");
      return false;
    }
  }

  async renderService(escrowId: number): Promise<boolean> {
    try {
      const tx = await this.contract.renderService(escrowId);
      toast.loading("Rendering service...");
      await tx.wait();
      toast.success("Service rendered successfully");
      return true;
    } catch (error) {
      console.error("Error rendering service:", error);
      toast.error("Failed to render service");
      return false;
    }
  }

  async releaseFunds(escrowId: number): Promise<boolean> {
    try {
      const tx = await this.contract.releaseFunds(escrowId);
      toast.loading("Releasing funds...");
      await tx.wait();
      toast.success("Funds released successfully");
      return true;
    } catch (error) {
      console.error("Error releasing funds:", error);
      toast.error("Failed to release funds");
      return false;
    }
  }

  async openDispute(escrowId: number): Promise<boolean> {
    try {
      const tx = await this.contract.openDispute(escrowId);
      toast.loading("Opening dispute...");
      await tx.wait();
      toast.success("Dispute opened successfully");
      return true;
    } catch (error) {
      console.error("Error opening dispute:", error);
      toast.error("Failed to open dispute");
      return false;
    }
  }

  async settleDispute(escrowId: number, winner: string): Promise<boolean> {
    try {
      const tx = await this.contract.settleDispute(escrowId, winner);
      toast.loading("Settling dispute...");
      await tx.wait();
      toast.success("Dispute settled successfully");
      return true;
    } catch (error) {
      console.error("Error settling dispute:", error);
      toast.error("Failed to settle dispute");
      return false;
    }
  }

  async getEscrowDetails(escrowId: number): Promise<Escrow | null> {
    try {
      const escrow = await this.contract.escrows(escrowId);
      return {
        id: escrowId,
        buyer: escrow.buyer,
        seller: escrow.seller,
        amount: ethers.formatEther(escrow.amount),
        status: [
          "Created",
          "Funded",
          "ServiceRendered",
          "Completed",
          "Disputed",
        ][escrow.status],
      };
    } catch (error) {
      console.error("Error fetching escrow details:", error);
      toast.error("Failed to fetch escrow details");
      return null;
    }
  }

  async getEscrowCount(): Promise<number> {
    try {
      const count = await this.contract.escrowCount();
      return count.toNumber();
    } catch (error) {
      console.error("Error fetching escrow count:", error);
      toast.error("Failed to fetch escrow count");
      return 0;
    }
  }

  async isAdmin(address: string): Promise<boolean> {
    try {
      const adminAddress = await this.contract.admin();
      return adminAddress.toLowerCase() === address.toLowerCase();
    } catch (error) {
      console.error("Error checking admin status:", error);
      toast.error("Failed to check admin status");
      return false;
    }
  }
}

export const createEscrowContractService = (
  contract: Contract,
  provider: BrowserProvider
): EscrowContractService => {
  return new EscrowContractService(contract, provider);
};
