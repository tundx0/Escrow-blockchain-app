"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useEscrowStore } from "@/stores/escrowStore";
import { AdminPanel } from "@/components/AdminPanel";

export default function AdminPage() {
  const { isAdmin, checkAdminStatus } = useEscrowStore();
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      await checkAdminStatus();
      if (!isAdmin) {
        router.push("/");
      }
    };
    checkAdmin();
  }, [checkAdminStatus, isAdmin, router]);

  return <AdminPanel />;
}
