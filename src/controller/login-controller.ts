"use client";
import { checkClientSideSession, createSessionFromClient } from "@/auth/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const useAuthController = () => {
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<boolean>(false);
  const router = useRouter();

  const loginAction = async (email: string, password: string) => {
    setAuthLoading(true);
    const result = await createSessionFromClient(email, password)

    if (result) {
      router.push("/")
      router.refresh()
    }  else {
      setAuthError(true);
      setAuthLoading(false);
    }
  }

  const sessionRedirect = () => {
    if(checkClientSideSession()) {
      router.push("/")
    }
  }

  useEffect(sessionRedirect, [router])

  return {
    authError,
    authLoading,
    loginAction
  }
}
