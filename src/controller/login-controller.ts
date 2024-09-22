import { checkClientSideSession, createSessionFromClient } from "@/auth/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const useAuthController = () => {
  const [authError, setAuthError] = useState<boolean>(false);
  const router = useRouter();

  const loginAction = async (email: string, password: string) => {
    if (await createSessionFromClient(email, password)) {
      router.push("/");
      setAuthError(false);
    }  else {
      setAuthError(true);
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
    loginAction
  }
}
