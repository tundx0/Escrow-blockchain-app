import { Contract, ethers, BigNumberish } from "ethers";
import EscrowABI from "@/lib/contracts/Escrow.json";
import { CONTRACT_ADDRESS } from "@/constants";
import { Escrow } from "@/types";
import { BrowserProvider } from "ethers";

class Web3Service {
  private static instance: Web3Service;
  private provider: BrowserProvider | null = null;
  private contract: ethers.Contract | null = null;
  private adminAddress: string | null = null;
  private initialized: boolean = false;
  private eventListeners: (() => void)[] = [];
  private subscribers: ((escrow: Escrow) => void)[] = [];

  public constructor() {}

  public static getInstance(): Web3Service {
    if (!Web3Service.instance) {
      Web3Service.instance = new Web3Service();
    }
    return Web3Service.instance;
  }

  public async initialize(): Promise<void> {
    if (this.initialized) return;

    if (
      typeof window !== "undefined" &&
      typeof window.ethereum !== "undefined"
    ) {
      try {
        this.provider = new BrowserProvider(window.ethereum);
        this.initialized = true;
      } catch (error) {
        console.error("Error initializing Web3Service:", error);
        throw error;
      }
    } else {
      console.error("Ethereum object not found. Install MetaMask.");
      throw new Error("Ethereum object not found. Install MetaMask.");
    }
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  public async getProvider(): Promise<BrowserProvider> {
    await this.ensureInitialized();
    return this.provider!;
  }

  public async getContract(): Promise<Contract> {
    await this.ensureInitialized();

    const signer = await this.provider?.getSigner();
    this.contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      EscrowABI.abi,
      signer
    );
    this.adminAddress = await this.contract.admin();
    this.setupEventListeners();

    return this.contract;
  }

  public async fetchAllEscrows(): Promise<Escrow[]> {
    await this.ensureInitialized();
    const contract = await this.getContract();

    const escrowCount = await contract.escrowCount();
    const escrows: Escrow[] = [];

    for (let i = 1; i <= escrowCount; i++) {
      const escrow = await contract.escrows(i);
      escrows.push({
        id: i,
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
      });
    }

    return escrows;
  }

  public async settleDispute(escrowId: number, winner: string): Promise<void> {
    await this.ensureInitialized();
    const contract = await this.getContract();

    try {
      const tx = await contract.settleDispute(escrowId, winner);
      await tx.wait();
    } catch (error) {
      console.error("Error settling dispute:", error);
      throw error;
    }
  }

  public async isAdmin(address: string): Promise<boolean> {
    await this.ensureInitialized();
    return this.adminAddress === address;
  }

  private setupEventListeners(): void {
    if (!this.contract) {
      console.error("Contract not initialized");
      return;
    }

    const handleEvent =
      (eventName: string) =>
      async (...args: any[]) => {
        console.log(`${eventName} event:`, ...args);
        const escrowId = args[0];
        await this.updateEscrowState(escrowId);
      };

    const events = [
      "EscrowCreated",
      "EscrowFunded",
      "ServiceRendered",
      "EscrowCompleted",
      "EscrowDisputed",
    ];

    events.forEach((event) => {
      const listener = handleEvent(event);
      this.contract!.on(event, listener);
      this.eventListeners.push(() => {
        this.contract!.off(event, listener);
      });
    });
  }

  private async updateEscrowState(escrowId: number): Promise<void> {
    if (!this.contract) return;

    try {
      const escrow = await this.contract.escrows(escrowId);
      const updatedEscrow: Escrow = {
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

      this.notifySubscribers(updatedEscrow);
    } catch (error) {
      console.error(`Failed to update escrow state for ID ${escrowId}:`, error);
    }
  }

  private notifySubscribers(escrow: Escrow): void {
    this.subscribers.forEach((callback) => callback(escrow));
  }

  public subscribeToEscrowUpdates(
    callback: (escrow: Escrow) => void
  ): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((cb) => cb !== callback);
    };
  }

  public cleanup(): void {
    this.eventListeners.forEach((listener) => listener());
    this.eventListeners = [];
    this.subscribers = [];
  }
}

export default new Web3Service();
