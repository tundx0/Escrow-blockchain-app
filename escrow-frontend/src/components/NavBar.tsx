"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useReadEscrowAdmin } from "@/lib/generated";
import { CONTRACT_ADDRESS } from "@/constants";

export const Navbar = () => {
  const { address: account } = useAccount();
  const { data: adminAddress } = useReadEscrowAdmin({
    address: CONTRACT_ADDRESS as `0x${string}`,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAdmin =
    account &&
    adminAddress &&
    account.toLowerCase() === adminAddress.toLowerCase();

  if (!mounted) {
    return (
      <nav className="bg-slate-950/60 border-b border-slate-800/80 backdrop-blur-md text-white py-4 px-6 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold tracking-wide">
            SecureEscrow
          </Link>
          <div className="h-10 w-32 bg-slate-800 animate-pulse rounded-xl" />
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-slate-950/60 border-b border-slate-800/80 backdrop-blur-md text-white py-4 px-6 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold tracking-wide hover:text-slate-300 transition">
          SecureEscrow
        </Link>
        <div className="flex items-center space-x-4">
          {isAdmin && (
            <Link
              href="/admin"
              className="bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition duration-300 px-4 py-2 rounded-xl font-medium text-sm"
            >
              Admin Panel
            </Link>
          )}
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
};
