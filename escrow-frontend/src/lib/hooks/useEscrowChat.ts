"use client";

import { useState, useEffect, useCallback } from "react";
import { useSignMessage, useAccount } from "wagmi";
import { verifyMessage } from "viem";
import { toast } from "react-hot-toast";

export interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: number;
}

export function useEscrowChat(escrowId: number, participants: string[]) {
  const { address: account } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSigning, setIsSigning] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  // Storage key specific to this escrow
  const storageKey = `escrow-chat-${escrowId}`;

  // Check if session is already authorized for this account
  useEffect(() => {
    if (!account) {
      setIsAuthenticated(false);
      setMessages([]);
      return;
    }

    const savedSession = sessionStorage.getItem(`${storageKey}-auth`);
    if (savedSession === account.toLowerCase()) {
      setIsAuthenticated(true);
      loadMessages();
    } else {
      setIsAuthenticated(false);
      setMessages([]);
    }
  }, [account, storageKey]);

  const loadMessages = useCallback(() => {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      try {
        setMessages(JSON.parse(raw));
      } catch (e) {
        console.error("Failed to parse chat messages:", e);
      }
    } else {
      setMessages([]);
    }
  }, [storageKey]);

  const authenticate = async () => {
    if (!account) {
      toast.error("Wallet not connected");
      return;
    }

    const isParticipant = participants.some(
      (p) => p.toLowerCase() === account.toLowerCase()
    );

    if (!isParticipant) {
      toast.error("You are not a participant of this escrow chat");
      return;
    }

    setIsSigning(true);
    const nonce = Math.floor(Math.random() * 1000000);
    const challengeMessage =
      `Welcome to SecureEscrow Chat.\n\n` +
      `Sign this message to prove ownership of your address and access the secure chat for Escrow #${escrowId}.\n\n` +
      `Account: ${account}\n` +
      `Nonce: ${nonce}`;

    const toastId = toast.loading("Requesting signature...");
    try {
      const signature = await signMessageAsync({ message: challengeMessage });

      // Verify the signature locally on the client
      const isValid = await verifyMessage({
        address: account as `0x${string}`,
        message: challengeMessage,
        signature,
      });

      if (isValid) {
        sessionStorage.setItem(`${storageKey}-auth`, account.toLowerCase());
        setIsAuthenticated(true);
        loadMessages();
        toast.success("Authenticated successfully", { id: toastId });
      } else {
        toast.error("Signature verification failed", { id: toastId });
      }
    } catch (error) {
      console.error("Signature failed:", error);
      toast.error("Signature rejected by user", { id: toastId });
    } finally {
      setIsSigning(false);
    }
  };

  const sendMessage = (content: string) => {
    if (!isAuthenticated || !account) {
      toast.error("Not authenticated to chat");
      return;
    }

    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      sender: account,
      content,
      timestamp: Date.now(),
    };

    const updated = [...messages, newMessage];
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setMessages(updated);
  };

  return {
    isAuthenticated,
    isSigning,
    messages,
    authenticate,
    sendMessage,
  };
}
