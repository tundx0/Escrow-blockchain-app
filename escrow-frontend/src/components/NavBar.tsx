"use client";

import React from "react";
import { useWeb3 } from "../lib/hooks/useWeb3";
import Link from "next/link";

export const Navbar = () => {
  const { account, connectWallet } = useWeb3();

  return (
    <nav className="bg-indigo-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          SecureEscrow
        </Link>
        {account ? (
          <span className="bg-indigo-700 px-4 py-2 rounded">
            {account.slice(0, 6)}...{account.slice(-4)}
          </span>
        ) : (
          <button
            onClick={connectWallet}
            className="bg-white text-indigo-600 px-4 py-2 rounded font-bold"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  );
};
