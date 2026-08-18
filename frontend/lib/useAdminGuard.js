"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/api";
import { getToken } from "@/lib/auth";

export function useAdminGuard() {
  const [status, setStatus] = useState("checking"); // checking | allowed | denied
  const router = useRouter();

  useEffect(() => {
    if (!getToken()) {
      router.push("/login?redirect=/admin");
      return;
    }

    getCurrentUser().then((user) => {
      if (!user || !user.is_admin) {
        setStatus("denied");
      } else {
        setStatus("allowed");
      }
    });
  }, []);

  return status;
}