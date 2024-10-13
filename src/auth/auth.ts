/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { getAuthData, updateAccessToken } from "@/data/auth-provider";
import AuthModel from "@/model/auth";
import Cookie from "js-cookie";
import { NextRequest } from "next/server";
import CryptoJS from "crypto-es";
import { SHA256 } from "crypto-es/lib/sha256";
import { AES } from "crypto-es/lib/aes";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { SHA512 } from "crypto-es/lib/sha512";

const getSecretKey = () => {
  const env = process.env["COOKIE_SECRET"] ?? "";
  const salt = "GUJx1SvnNFTYFw1veVTO";
  let key = "";
  
  if (env !== "") {
    key = SHA256(env.trim()).toString();
    const part1 = key.slice(0, 32);
    const part2 = key.slice(32, 64);
    const hash1 = SHA256(salt + part1).toString();
    const hash2 = SHA256(part2 + salt).toString();
    key = SHA512(hash1 + hash2).toString();
    return key;
  } else {
    key = SHA256(salt).toString();
    const part1 = key.slice(0, 32);
    const part2 = key.slice(32, 64);
    const hash1 = SHA256(part1 + salt).toString();
    const hash2 = SHA256(salt + part2).toString();
    key = SHA512(hash1 + hash2).toString();
  }

  return key;
}

const encryptCookie = (cookie: string) => {
  return AES.encrypt(cookie, getSecretKey()).toString();
}

const decryptCookie = (cookie: string) => {
  return AES.decrypt(cookie, getSecretKey()).toString(CryptoJS.enc.Utf8);
}

const setSessionDocumentCookie = (cookie: string) => {
  const encryptedCookie = encryptCookie(cookie);
  Cookie.set("session", encryptedCookie, { expires: 30 });
};

const createSessionFromClient = async (username: string, password: string) => {
  const auth = await getAuthData(username, password);

  if (auth !== null) {
    const cookieValue = JSON.stringify(auth);
    setSessionDocumentCookie(cookieValue);
    return true;
  }

  return false;
};

const removeSessionFromClient = (router: AppRouterInstance) => {
  Cookie.remove("session");
  router.push("/authentication/login");
};

const getSessionData = (): AuthModel | null => {
  try {
    const cookie = Cookie.get("session");

    if (cookie) {
      const decryptedCookie = decryptCookie(cookie);
      return JSON.parse(decryptedCookie) as AuthModel;
    }

    return null;
  } catch (e) {
    return null;
  }
};

const getSessionDataFromRequest = (request: NextRequest): AuthModel | null => {
  try {
    const cookie = request.cookies.get("session");

    if (cookie) {
      const decryptedCookie = decryptCookie(cookie.value);
      return JSON.parse(decryptedCookie) as AuthModel;
    }

    return null;
  } catch (e) {
    return null;
  }
};

const checkClientSideSession = () => {
  try {
    const session = getSessionData();
    if (session) {
      const stringifySession = JSON.stringify(session);
      const { accessToken, refreshToken, user } = JSON.parse(
        stringifySession
      ) as AuthModel;

      if (accessToken && refreshToken && user) {
        return true;
      }
    }

    return false;
  } catch (e) {
    return false;
  }
};

const checkServerSideSession = async (
  request: NextRequest
): Promise<boolean> => {
  try {
    const session = getSessionDataFromRequest(request);
    if (session) {
      const stringifySession = JSON.stringify(session);
      const { accessToken, refreshToken, user } = JSON.parse(
        stringifySession
      ) as AuthModel;

      if (accessToken && refreshToken && user) {
        return true;
      }
    }

    return false;
  } catch (e) {
    return false;
  }
};

const fetchWithSession = async (
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> => {
  const fetchWithAccessToken = (session: AuthModel) => {
    const headers = new Headers(init?.headers);
    headers.set("X-Access-Token", session.accessToken);
    init = {
      ...init,
      headers,
    };

    return fetch(input, init);
  };

  let session = getSessionData();
  if (session) {
    const response = await fetchWithAccessToken(session);

    if (response.status === 401) {
      const accessToken = await updateAccessToken(session.refreshToken);
      const cookieValue = JSON.stringify({
        ...session,
        accessToken: accessToken,
      });
      setSessionDocumentCookie(cookieValue);
      session = getSessionData();
      return fetchWithAccessToken(session!);
    } else {
      return response;
    }
  }

  return fetch(input, init);
};

export {
  createSessionFromClient,
  removeSessionFromClient,
  checkServerSideSession,
  checkClientSideSession,
  fetchWithSession,
};
