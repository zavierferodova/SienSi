import { fetchWithSession } from "@/auth/auth";
import { API_BASE_PATH } from "@/constant/constant";
import GuestModel from "@/model/guest";

export type GuestPaginationResponse = {
  guests: GuestModel[];
  total: number;
  page: number;
  limit: number;
};

export const getGuestPagination = async (
  roomId: string,
  page = 1,
  limit = 10,
  search = ""
): Promise<GuestPaginationResponse | null> => {
  try {
    const response = await fetchWithSession(
      `${API_BASE_PATH}/room/${roomId}/guest?page=${page}&limit=${limit}&search=${search}`
    );

    if (response.ok) {
      const json = await response.json();
      return json.data as GuestPaginationResponse;
    }

    return null;
  } catch (error) {
    return null;
  }
};

export const getGuestQRKey = async (
  id: string,
  roomId: string
): Promise<string | null> => {
  try {
    const response = await fetchWithSession(
      `${API_BASE_PATH}/room/${roomId}/guest/${id}/qrkey`
    );

    if (response.ok) {
      const json = await response.blob();
      return URL.createObjectURL(json);
    }

    return null;
  } catch (error) {
    return null;
  }
};

export const addGuest = async (
  guest: GuestModel,
  roomId: string
): Promise<boolean> => {
  try {
    const response = await fetchWithSession(
      `${API_BASE_PATH}/room/${roomId}/guest`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(guest),
      }
    );

    return response.ok;
  } catch (error) {
    return false;
  }
};

export const updateGuest = async (
  guest: GuestModel,
  roomId: string
): Promise<boolean> => {
  try {
    const response = await fetchWithSession(
      `${API_BASE_PATH}/room/${roomId}/guest/${guest.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(guest),
      }
    );

    return response.ok;
  } catch (error) {
    return false;
  }
};

export const deleteGuest = async (
  id: string,
  roomId: string
): Promise<boolean> => {
  try {
    const response = await fetchWithSession(
      `${API_BASE_PATH}/room/${roomId}/guest/${id}`,
      {
        method: "DELETE",
      }
    );

    return response.ok;
  } catch (error) {
    return false;
  }
};

export const sendAllQrCode = async (roomId: string): Promise<boolean> => {
  try {
    const response = await fetchWithSession(
      `${API_BASE_PATH}/room/${roomId}/send-all-qrcode`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.ok;
  } catch (error) {
    return false;
  }
};
