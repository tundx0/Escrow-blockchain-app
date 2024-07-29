# 🔐 Escrow Blockchain App

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This repository contains a blockchain-based escrow application. The project is divided into two main parts:

1. **Escrow Contracts**: Solidity smart contracts stored in the `escrow` folder, developed using Foundry.
2. **Escrow Frontend**: A Next.js frontend application located in the `escrow-frontend` folder.

## 📑 Table of Contents

- [Overview](#-overview)
- [Prerequisites](#-prerequisites)
- [Setup](#-setup)
- [Deploying Contracts](#-deploying-contracts)
- [Running the Frontend](#-running-the-frontend)
- [Project Structure](#-project-structure)
- [License](#-license)

## 🌟 Overview

The Escrow Blockchain App is designed to facilitate secure transactions between buyers and sellers by using smart contracts on the Ethereum blockchain. The contracts handle the creation, funding, service rendering, dispute opening, and settlement of escrow transactions.

## 🛠 Prerequisites

To run this project, you need to have the following installed:

- [Node.js](https://nodejs.org/) (v20 or later)
- [npm](https://www.npmjs.com/) (v6 or later) or [yarn](https://yarnpkg.com/) (v1.22 or later)
- [Foundry](https://getfoundry.sh/) (latest version)
- [MetaMask](https://metamask.io/) or another Ethereum wallet

## 🚀 Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/tundx0/escrow-blockchain-app.git
   cd escrow-blockchain-app
   ```

2. Install dependencies for the frontend:
   ```sh
   cd escrow-frontend
   npm install
   # or
   yarn install
   ```

3. Return to the root directory:
   ```sh
   cd ..
   ```

## 📜 Deploying Contracts

To deploy the smart contracts:

1. Navigate to the `escrow` directory:
   ```sh
   cd escrow
   ```

2. Compile the contracts:
   ```sh
   forge build
   ```

3. Deploy the contracts to your chosen network:
   ```sh
   forge script script/DeployEscrow.s.sol:DeployEscrow --rpc-url <YOUR_RPC_URL> --private-key <YOUR_PRIVATE_KEY> --broadcast
   ```

   > ⚠️ Replace `<YOUR_RPC_URL>` with your Ethereum node's RPC URL and `<YOUR_PRIVATE_KEY>` with your wallet's private key.

## 💻 Running the Frontend

To run the frontend application:

1. Navigate to the `escrow-frontend` directory:
   ```sh
   cd escrow-frontend
   ```

2. Create a `.env.local` file and add the necessary environment variables:
   ```
   NEXT_PUBLIC_CONTRACT_ADDRESS=<YOUR_DEPLOYED_CONTRACT_ADDRESS>
   NEXT_PUBLIC_RPC_URL=<YOUR_RPC_URL>
   ```

3. Start the development server:
   ```sh
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:3000` to interact with the application.

## 📁 Project Structure

```
escrow-blockchain-app/
├── escrow/
│   ├── src/
│   │   └── Escrow.sol
│   ├── test/
│   │   └── Escrow.t.sol
│   └── script/
│       └── DeployEscrow.s.sol
├── escrow-frontend/
│   ├── src/
|     ├── app/
│       ├── components/
│       ├── styles/
|       └── page.tsx
|       └── layout.tsx
│   └── public/
└── README.md
```

- `escrow/`: Contains the Solidity smart contracts and related Foundry files.
- `escrow-frontend/`: Houses the Next.js frontend application.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <strong>Built with ❤️ by [tundx0]</strong>
</div>
