import { fetchWithSession } from "@/auth/auth";
import { API_BASE_PATH } from "@/constant/constant";
import RoomModel from "@/model/room";

export type RoomPaginationResponse = {
  rooms: RoomModel[];
  total: number;
  page: number;
  limit: number;
};
export type RoomResponse = {
  room: RoomModel;
};

export const getRoom = async (roomId: string): Promise<RoomResponse | null> => {
  try {
    const response = await fetchWithSession(`${API_BASE_PATH}/room/${roomId}`);

    if (response.ok) {
      const json = await response.json();
      return json.data as RoomResponse;
    }

    return null;
  } catch (error) {
    return null;
  }
};
export const getRoomPagination = async (
  page = 1,
  limit = 10,
  search = ""
): Promise<RoomPaginationResponse | null> => {
  try {
    const response = await fetchWithSession(
      `${API_BASE_PATH}/room?page=${page}&limit=${limit}&search=${search}`
    );

    if (response.ok) {
      const json = await response.json();
      return json.data as RoomPaginationResponse;
    }

    return null;
  } catch (error) {
    return null;
  }
};

export const addRoom = async (room: RoomModel): Promise<boolean> => {
  try {
    const response = await fetchWithSession(`${API_BASE_PATH}/room`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(room),
    });

    return response.ok;
  } catch (error) {
    return false;
  }
};

export const updateRoom = async (
  room: RoomModel,
  roomId: string
): Promise<boolean> => {
  try {
    const response = await fetchWithSession(`${API_BASE_PATH}/room/${roomId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(room),
    });

    return response.ok;
  } catch (error) {
    return false;
  }
};

export const deleteRoom = async (roomId: string): Promise<boolean> => {
  try {
    const response = await fetchWithSession(`${API_BASE_PATH}/room/${roomId}`, {
      method: "DELETE",
    });

    return response.ok;
  } catch (error) {
    return false;
  }
};
