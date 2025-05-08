"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/NavBar";
import { Web3Provider } from "@/contexts/Web3Context";

import { useEscrowContract } from "@/lib/hooks/useEscrowContract";
import web3Service from "@/lib/services/web3Service";
import { useEffect } from "react";
import { useWeb3 } from "@/lib/hooks/useWeb3";
import { useEscrowStore } from "@/stores/escrowStore";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Escrow Blockchain App",
//   description: "Escrow App",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { checkIfConnected } = useWeb3();
  const { subscribeToUpdates } = useEscrowStore();

  useEffect(() => {
    const initializeApp = async () => {
      await web3Service.initialize();
      checkIfConnected();
      subscribeToUpdates();
    };

    initializeApp();

    return () => {
      web3Service.cleanup();
    };
  }, [checkIfConnected, subscribeToUpdates]);

  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="container mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
