/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { getAuthData, updateAccessToken } from "@/data/auth-provider";
import AuthModel from "@/model/auth";
import Cookie from "js-cookie";
import { NextRequest } from "next/server";
import CryptoJS from "crypto-js";
import AES from "crypto-js/aes";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const setSessionDocumentCookie = (cookie: string) => {
  const encryptedCookie = AES.encrypt(
    cookie,
    process.env["NEXT_PUBLIC_COOKIE_SECRET"]!.trim()
  ).toString();
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
      const decryptedCookie = AES.decrypt(
        cookie,
        process.env["NEXT_PUBLIC_COOKIE_SECRET"]?.trim() ?? ""
      ).toString(CryptoJS.enc.Utf8);
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
      const decryptedCookie = AES.decrypt(
        cookie.value,
        process.env["NEXT_PUBLIC_COOKIE_SECRET"]?.trim() ?? ""
      ).toString(CryptoJS.enc.Utf8);
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
