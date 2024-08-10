"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ethers } from "ethers";
import { useWeb3Context } from "@/contexts/Web3Context";
import { useClickOutside } from "@/lib/hooks/useClickOutside";

export const Navbar = () => {
  const { account, connectWallet, provider, disconnectWallet } =
    useWeb3Context();
  const [balance, setBalance] = useState<string | null>(null);
  const [showDisconnect, setShowDisconnect] = useState<boolean>(false);

  useEffect(() => {
    const fetchBalance = async () => {
      if (provider && account) {
        const balance = await provider.getBalance(account);
        setBalance(ethers.formatEther(balance));
      }
    };

    fetchBalance();
  }, [provider, account]);

  const toggleDisconnect = () => {
    setShowDisconnect(!showDisconnect);
  };
  const hideDisconnect = () => {
    setShowDisconnect(false);
  };

  const handleDisconnect = () => {
    setShowDisconnect(false);
    disconnectWallet();
  };

  const disconnectRef = useClickOutside<HTMLDivElement>(hideDisconnect);

  return (
    <nav className="bg-indigo-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          SecureEscrow
        </Link>
        {account ? (
          <div
            className="relative flex items-center space-x-4"
            ref={disconnectRef}
          >
            <span
              className="bg-indigo-700 px-4 py-2 rounded cursor-pointer"
              onClick={toggleDisconnect}
            >
              {account.slice(0, 6)}...{account.slice(-4)}
            </span>
            <span className="bg-indigo-500 px-4 py-2 rounded">
              Balance: {balance ? `${balance.slice(0, 6)} ETH` : "Loading..."}
            </span>
            {showDisconnect && (
              <button
                onClick={handleDisconnect}
                className="absolute top-full mt-2 bg-red-600 text-white px-4 py-2 rounded shadow-lg"
              >
                Disconnect
              </button>
            )}
          </div>
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
