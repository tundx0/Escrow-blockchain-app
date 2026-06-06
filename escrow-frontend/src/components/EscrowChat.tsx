"use client";

import React, { useState, useRef, useEffect } from "react";
import { useEscrowChat, ChatMessage } from "@/lib/hooks/useEscrowChat";
import { useAccount } from "wagmi";

interface EscrowChatProps {
  escrowId: number;
  buyer: string;
  seller: string;
  admin: string;
}

export const EscrowChat: React.FC<EscrowChatProps> = ({
  escrowId,
  buyer,
  seller,
  admin,
}) => {
  const { address: account } = useAccount();
  const participants = [buyer, seller, admin];
  const { isAuthenticated, isSigning, messages, authenticate, sendMessage } =
    useEscrowChat(escrowId, participants);

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput("");
  };

  const getRoleLabel = (sender: string) => {
    const s = sender.toLowerCase();
    if (s === admin.toLowerCase()) return "Admin";
    if (s === buyer.toLowerCase()) return "Buyer";
    if (s === seller.toLowerCase()) return "Seller";
    return "User";
  };

  const getRoleStyle = (sender: string) => {
    const role = getRoleLabel(sender);
    switch (role) {
      case "Admin":
        return "bg-red-950/40 border border-red-500 text-red-100";
      case "Buyer":
        return "bg-indigo-950/40 border border-indigo-500 text-indigo-100";
      case "Seller":
        return "bg-purple-950/40 border border-purple-500 text-purple-100";
      default:
        return "bg-gray-900 border border-gray-800 text-gray-200";
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-slate-950/80 border border-slate-800/80 backdrop-blur-md rounded-2xl p-8 text-center shadow-lg mt-8 max-w-lg mx-auto">
        <div className="text-4xl mb-4">💬</div>
        <h3 className="text-xl font-bold text-gray-100 mb-2">
          Secure Participant Chat
        </h3>
        <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
          Access is restricted to escrow participants. Sign a standard web3
          cryptographic signature to verify ownership of your connected account
          and read chat logs.
        </p>
        <button
          onClick={authenticate}
          disabled={isSigning}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-xl transition duration-300 shadow-md cursor-pointer disabled:bg-indigo-800"
        >
          {isSigning ? "Signing Challenge..." : "Authenticate Wallet Chat"}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-950/80 border border-slate-800/80 backdrop-blur-md rounded-2xl shadow-xl mt-8 flex flex-col h-[480px]">
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="font-bold text-gray-100">Escrow Secure Chat</h3>
        </div>
        <span className="text-xs text-gray-400 font-mono">
          Escrow #{escrowId}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500 text-sm italic">
            No messages sent yet. Start the conversation.
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = account?.toLowerCase() === msg.sender.toLowerCase();
            const role = getRoleLabel(msg.sender);
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-[10px] text-gray-400 font-mono">
                    {msg.sender.slice(0, 6)}...{msg.sender.slice(-4)}
                  </span>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                      role === "Admin"
                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                        : role === "Buyer"
                        ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                        : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                    }`}
                  >
                    {role}
                  </span>
                </div>
                <div
                  className={`p-3 rounded-2xl max-w-sm text-sm shadow-sm ${getRoleStyle(
                    msg.sender
                  )}`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>
                </div>
                <span className="text-[9px] text-gray-500 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="p-3 border-t border-slate-800/80 flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your secure message..."
          className="flex-1 bg-slate-900 border border-slate-800 focus:border-indigo-500 text-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 rounded-xl text-sm transition cursor-pointer"
        >
          Send
        </button>
      </form>
    </div>
  );
};
