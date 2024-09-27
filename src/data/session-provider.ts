import { fetchWithSession } from "@/auth/auth";
import { API_BASE_PATH } from "@/constant/constant";
import SessionModel from "@/model/session";

export type SessionPaginationResponse = {
  sessions: SessionModel[];
  total: number;
  page: number;
  limit: number;
};
export type SessionResponse = {
  session: SessionModel;
};

export const getSession = async (
  roomId: string,
  sessionId: string
): Promise<SessionResponse | null> => {
  try {
    const response = await fetchWithSession(
      `${API_BASE_PATH}/room/${roomId}/session/${sessionId}`
    );

    if (response.ok) {
      const json = await response.json();
      return json.data as SessionResponse;
    }

    return null;
  } catch (error) {
    return null;
  }
};
export const getSessionPagination = async (
  page = 1,
  limit = 10,
  search = "",
  roomId: string
): Promise<SessionPaginationResponse | null> => {
  try {
    const response = await fetchWithSession(
      `${API_BASE_PATH}/room/${roomId}/session?page=${page}&limit=${limit}&search=${search}`
    );

    if (response.ok) {
      const json = await response.json();
      return json.data as SessionPaginationResponse;
    }

    return null;
  } catch (error) {
    return null;
  }
};

export const addSession = async (
  session: SessionModel,
  roomId: string
): Promise<boolean> => {
  try {
    const response = await fetchWithSession(
      `${API_BASE_PATH}/room/${roomId}/session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(session),
      }
    );

    return response.ok;
  } catch (error) {
    return false;
  }
};

export const updateSession = async (
  session: SessionModel,
  roomId: string
): Promise<boolean> => {
  try {
    const response = await fetchWithSession(
      `${API_BASE_PATH}/room/${roomId}/session/${session.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(session),
      }
    );

    return response.ok;
  } catch (error) {
    return false;
  }
};

export const deleteSession = async (
  id: string,
  roomId: string
): Promise<boolean> => {
  try {
    const response = await fetchWithSession(
      `${API_BASE_PATH}/room/${roomId}/session/${id}`,
      {
        method: "DELETE",
      }
    );

    return response.ok;
  } catch (error) {
    return false;
  }
};
