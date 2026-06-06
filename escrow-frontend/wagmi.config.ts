import { defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import EscrowABI from "./src/lib/contracts/Escrow.json";

export default defineConfig({
  out: "src/lib/generated.ts",
  contracts: [
    {
      name: "Escrow",
      abi: EscrowABI.abi as any,
    },
  ],
  plugins: [react()],
});
