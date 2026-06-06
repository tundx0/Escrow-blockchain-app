# 🔐 Modernized Escrow Blockchain App

[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](https://opensource.org/licenses/MIT)

A premium, highly secure decentralized escrow application designed to facilitate trustless, on-chain transactions between buyers and sellers. The codebase has been fully modernized utilizing state-of-the-art Web3 developer toolings, styling protocols, and cryptographical validations.

## 📑 Table of Contents

- [Core Stack & Upgrades](#-core-stack--upgrades)
- [Key Features](#-key-features)
- [Prerequisites](#-prerequisites)
- [Installation & Local Setup](#-installation--local-setup)
- [Smart Contract Deployment](#-smart-contract-deployment)
- [Running the Frontend](#-running-the-frontend)
- [Architecture & Design Systems](#-architecture--design-systems)
- [License](#-license)

---

## 🚀 Core Stack & Upgrades

This project utilizes a cutting-edge frontend and Web3 stack to ensure fast compilation, type-safety, and reactive synchronization:

*   **Framework**: [Next.js v16](https://nextjs.org/) (App Router) + [React v19](https://react.dev/)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (using CSS-first `@import "tailwindcss"` and native postcss plugins)
*   **Package Manager**: `pnpm` (Workspace/Lockfile optimization)
*   **Web3 Integration**: [Wagmi v2](https://wagmi.sh/) + [Viem v2](https://viem.sh/) + [TanStack React Query v5](https://tanstack.com/query/latest)
*   **Wallet Interface**: [RainbowKit v2](https://www.rainbowkit.com/)
*   **Smart Contract Tooling**: [Foundry](https://getfoundry.sh/) (`forge`, `anvil`)

---

## 🌟 Key Features

### 1. Interactive Payment QR Checkout Display
Inspired by industry-standard crypto payment gateways (like Bitrefill), the dynamic escrow details page features an interactive checkout block:
*   Generates **ERC-681 transaction request URIs** (`ethereum:CONTRACT_ADDRESS/fundEscrow?uint256=ID`).
*   Renders a responsive **QR Code** for direct scans from mobile web3 wallets.
*   One-click copy-to-clipboard utilities with real-time UI status updates.
*   Transition states: Displays the QR code during funding phases, shifting to a green **"Escrow Fully Funded (On-Chain Verified)"** shield once the state is confirmed on-chain.

### 💬 EIP-191 Signature-Authenticated Participant Chat
To negotiate details or resolve disputes securely, participants have access to a cryptographically locked messenger:
*   Users sign a challenge message (`personal_sign`) to prove ownership of their account.
*   Signatures are verified **locally on the client** using `viem`'s `verifyMessage` before unlocking logs.
*   Only verified buyers, sellers, or contract administrators are authorized to read or post messages.
*   Chat bubbles are colored according to participant role (Buyer, Seller, Admin) to resemble a full-scale messaging board.

### 🛠 Automated Type-Safe Hook Generation
*   Uses `@wagmi/cli` (configured in `wagmi.config.ts`) to read Foundry's compiler ABI JSON and automatically generate type-safe React contract hooks (`useReadEscrowEscrows`, `useWriteEscrowCreateEscrow`, `useWatchEscrowEscrowCreatedEvent`).
*   Eliminates manual ABI copy-pasting, custom typings, or raw contract initializations.

---

## 🛠 Prerequisites

To run this project locally, ensure you have the following installed:

*   [Node.js](https://nodejs.org/) (v20 or later)
*   [pnpm](https://pnpm.io/) (v10 or later)
*   [Foundry](https://getfoundry.sh/) (for Anvil local node and Forge contract compilation)
*   [MetaMask](https://metamask.io/) browser extension

---

## 📦 Installation & Local Setup

1.  Clone the repository:
    ```sh
    git clone https://github.com/tundx0/escrow-blockchain-app.git
    cd escrow-blockchain-app
    ```

2.  Install dependencies for the frontend using `pnpm`:
    ```sh
    cd escrow-frontend
    pnpm install
    ```

---

## 📜 Smart Contract Deployment

1.  Start a local Ethereum node using **Anvil** (run in a separate terminal window):
    ```sh
    anvil
    ```
    *This will start a local chain at `http://127.0.0.1:8545` and list 10 test accounts with private keys.*

2.  Deploy the contracts to your running Anvil node:
    ```sh
    cd escrow
    forge script script/DeployEscrow.s.sol:DeployEscrow --rpc-url http://127.0.0.1:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast
    ```

3.  Copy the deployed contract address (default is `0x5FbDB2315678afecb367f032d93F642f64180aa3`) and update it in `escrow-frontend/src/constants.ts`:
    ```typescript
    export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3" as const;
    ```

---

## 💻 Running the Frontend

1.  Navigate to the `escrow-frontend` folder:
    ```sh
    cd escrow-frontend
    ```

2.  Generate a Project ID at [reown.com](https://cloud.reown.com/) for WalletConnect, and create a `.env.local` file:
    ```env
    NEXT_PUBLIC_WC_PROJECT_ID=your_reown_project_id
    ```

3.  Execute the Wagmi CLI tool to generate the type-safe React contract hooks:
    ```sh
    pnpm wagmi generate
    ```

4.  Start the Next.js development server:
    ```sh
    pnpm dev
    ```

5.  Open your browser and navigate to `http://localhost:3000`. Connect your MetaMask wallet (switch MetaMask to the **Anvil Localhost** network on Chain ID `31337`).

---

## 📁 Architecture & Design Systems

```
escrow-blockchain-app/
├── escrow/
│   ├── src/Escrow.sol             # solidity smart contract
│   ├── script/DeployEscrow.s.sol  # foundry deployment script
│   └── foundry.toml               # cleaned compiler settings
├── escrow-frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── admin/             # admin panel view
│   │   │   ├── escrow/[id]/       # interactive checkout & chat details page
│   │   │   ├── globals.css        # tailwind v4 theme variables
│   │   │   └── layout.tsx         # layout wrapper injection
│   │   ├── components/
│   │   │   ├── EscrowChat.tsx     # EIP-191 signature chat board
│   │   │   ├── NavBar.tsx         # glassmorphic header w/ connect button
│   │   │   └── ui/                # glassmorphic cards & glowing gradient buttons
│   │   ├── contexts/
│   │   │   └── Web3Provider.tsx   # wagmi, query-client, and rainbowkit context
│   │   ├── lib/
│   │   │   ├── generated.ts       # auto-generated wagmi contract hooks
│   │   │   ├── wagmi.ts           # rainbowkit config & project id diagnostics
│   │   │   └── hooks/
│   │   │       ├── useEscrows.ts  # multi-contract batch read helper
│   │   │       └── useEscrowChat.ts # signature verification manager
│   │   └── constants.ts           # contract address config
│   ├── wagmi.config.ts            # wagmi-cli plugin configuration
│   └── package.json
└── README.md
```

### UX & Brand Visuals: "Electric Obsidian"
To present a stunning developer portfolio piece:
*   **Translucent Navigation**: The header blends seamlessly using translucent glassmorphism (`bg-slate-950/60`, `backdrop-blur-md`, `border-slate-800/80`), keeping layout focus on checkout actions.
*   **Cohesive Palette**: Swapped old elements for a deep obsidian space backdrop accented by neon-violet card glows, high-fidelity purple button gradients, and green confirmations.
*   **Hydration Checks**: Wrapped Web3 variables in mounted checks to prevent hydration flashing on refresh.
