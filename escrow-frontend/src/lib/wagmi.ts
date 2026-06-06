import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { foundry, sepolia } from "wagmi/chains";

// Fetch the project ID from environment variables.
// Users running this demo locally should create their own Project ID at cloud.reown.com
// and define NEXT_PUBLIC_WC_PROJECT_ID in their .env.local file.
const walletConnectProjectId =
  process.env.NEXT_PUBLIC_WC_PROJECT_ID || "3fcc6b596dfcae73b522d40d39b322f5";

if (!process.env.NEXT_PUBLIC_WC_PROJECT_ID) {
  console.warn(
    "Wagmi Warning: NEXT_PUBLIC_WC_PROJECT_ID is not configured in environment variables. " +
      "WalletConnect might throw allowlist/origin errors on localhost. " +
      "Please create an app at https://cloud.reown.com and set NEXT_PUBLIC_WC_PROJECT_ID in .env.local"
  );
}

export const config = getDefaultConfig({
  appName: "SecureEscrow",
  projectId: walletConnectProjectId,
  chains: [foundry, sepolia],
  ssr: true,
});
