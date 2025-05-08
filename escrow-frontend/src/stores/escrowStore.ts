import { create } from "zustand";
import web3Service from "@/lib/services/web3Service";
import { Escrow } from "@/types";
import { ethers } from "ethers";
import { BrowserProvider } from "ethers";

interface EscrowStore {
  escrows: Escrow[];
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
  account: string | null;
  provider: BrowserProvider | null;
  setProvider: (provider: BrowserProvider | null) => void;
  setAccount: (account: string | null) => void;
  fetchEscrows: () => Promise<void>;
  addEscrow: (escrow: Escrow) => void;
  updateEscrow: (updatedEscrow: Partial<Escrow> & { id: number }) => void;
  settleDispute: (escrowId: number, winner: string) => Promise<void>;
  createEscrow: (seller: string, amount: string) => Promise<void>;
  fundEscrow: (escrowId: number) => Promise<void>;
  renderService: (escrowId: number) => Promise<void>;
  releaseFunds: (escrowId: number) => Promise<void>;
  openDispute: (escrowId: number) => Promise<void>;
  setError: (error: string | null) => void;
  checkAdminStatus: () => Promise<void>;
  subscribeToUpdates: () => () => void;
}

export const useEscrowStore = create<EscrowStore>((set, get) => ({
  escrows: [],
  isAdmin: false,
  loading: false,
  error: null,
  account: null,
  provider: null,
  setProvider: (provider) => set({ provider }),
  setAccount: (account) => set({ account }),
  checkAdminStatus: async () => {
    try {
      const provider = await web3Service.getProvider();
      const address = (await provider.getSigner()).address;
      const isAdmin = await web3Service.isAdmin(address);
      set({ isAdmin });
    } catch (error) {
      console.error("Error checking admin status:", error);
      set({ error: (error as Error).message });
    }
  },

  fetchEscrows: async () => {
    set({ loading: true, error: null });
    try {
      const escrows = await web3Service.fetchAllEscrows();
      set({ escrows, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  addEscrow: (escrow) =>
    set((state) => ({ escrows: [...state.escrows, escrow] })),

  updateEscrow: (updatedEscrow) =>
    set((state) => ({
      escrows: state.escrows.map((escrow) =>
        escrow.id === updatedEscrow.id
          ? { ...escrow, ...updatedEscrow }
          : escrow
      ),
    })),

  settleDispute: async (escrowId, winner) => {
    set({ loading: true, error: null });
    try {
      await web3Service.settleDispute(escrowId, winner);
      set((state) => ({
        escrows: state.escrows.map((escrow) =>
          escrow.id === escrowId ? { ...escrow, status: "Completed" } : escrow
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  createEscrow: async (seller, amount) => {
    set({ loading: true, error: null });
    try {
      const contract = await web3Service.getContract();
      const tx = await contract.createEscrow(seller, {
        value: ethers.parseEther(amount),
      });
      await tx.wait();
      await get().fetchEscrows(); // Refresh the escrows list
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fundEscrow: async (escrowId) => {
    set({ loading: true, error: null });
    try {
      const contract = await web3Service.getContract();
      const tx = await contract.fundEscrow(escrowId);
      await tx.wait();
      set((state) => ({
        escrows: state.escrows.map((escrow) =>
          escrow.id === escrowId ? { ...escrow, status: "Funded" } : escrow
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  renderService: async (escrowId) => {
    set({ loading: true, error: null });
    try {
      const contract = await web3Service.getContract();
      const tx = await contract.renderService(escrowId);
      await tx.wait();
      set((state) => ({
        escrows: state.escrows.map((escrow) =>
          escrow.id === escrowId
            ? { ...escrow, status: "ServiceRendered" }
            : escrow
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  releaseFunds: async (escrowId) => {
    set({ loading: true, error: null });
    try {
      const contract = await web3Service.getContract();
      const tx = await contract.releaseFunds(escrowId);
      await tx.wait();
      set((state) => ({
        escrows: state.escrows.map((escrow) =>
          escrow.id === escrowId ? { ...escrow, status: "Completed" } : escrow
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  openDispute: async (escrowId) => {
    set({ loading: true, error: null });
    try {
      const contract = await web3Service.getContract();
      const tx = await contract.openDispute(escrowId);
      await tx.wait();
      set((state) => ({
        escrows: state.escrows.map((escrow) =>
          escrow.id === escrowId ? { ...escrow, status: "Disputed" } : escrow
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  subscribeToUpdates: () => {
    const unsubscribe = web3Service.subscribeToEscrowUpdates(
      (updatedEscrow) => {
        set((state) => ({
          escrows: state.escrows.map((escrow) =>
            escrow.id === updatedEscrow.id ? updatedEscrow : escrow
          ),
        }));
      }
    );
    return unsubscribe;
  },
  setError: (error) => set({ error }),
}));
