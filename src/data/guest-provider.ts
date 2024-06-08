import { fetchWithSession } from "@/auth/auth";
import { API_BASE_PATH } from "@/constant/constant";
import GuestModel from "@/model/guest";

export type GuestPaginationResponse = {
  guests: GuestModel[];
  total: number;
  page: number;
  limit: number;
};

export const getGuestPagination = async ({
  page = 1,
  limit = 10,
  search = "",
}): Promise<GuestPaginationResponse | null> => {
  try {
    const response = await fetchWithSession(
      API_BASE_PATH + `/guest?page=${page}&limit=${limit}&search=${search}`
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

export const getGuestQRKey = async (id: string): Promise<string | null> => {
  try {
    const response = await fetchWithSession(
      API_BASE_PATH + `/guest/${id}/qrkey`
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

export const addGuest = async (guest: GuestModel): Promise<boolean> => {
  try {
    const response = await fetchWithSession(API_BASE_PATH + "/guest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(guest),
    });

    return response.ok;
  } catch (error) {
    return false;
  }
};

export const updateGuest = async (guest: GuestModel): Promise<boolean> => {
  try {
    const response = await fetchWithSession(
      API_BASE_PATH + `/guest/${guest.id}`,
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

export const deleteGuest = async (id: string): Promise<boolean> => {
  try {
    const response = await fetchWithSession(API_BASE_PATH + `/guest/${id}`, {
      method: "DELETE",
    });

    return response.ok;
  } catch (error) {
    return false;
  }
};
