import { fetchWithSession } from "@/auth/auth";
import { API_BASE_PATH } from "@/constant/constant";
import {
  InsightsModel,
  TopRoomAttendancesModel,
  TopRoomsModel,
} from "@/model/dashboard";

export const getInsight = async (): Promise<InsightsModel | null> => {
  try {
    const response = await fetchWithSession(`${API_BASE_PATH}/dashboard/main`);

    if (response.ok) {
      const json = await response.json();
      return json.data as InsightsModel;
    }

    return null;
  } catch (error) {
    return null;
  }
};
export const getTopRooms = async (): Promise<TopRoomsModel | null> => {
  try {
    const response = await fetchWithSession(
      `${API_BASE_PATH}/dashboard/top-guest-room`
    );

    if (response.ok) {
      const json = await response.json();
      return json.data as TopRoomsModel;
    }

    return null;
  } catch (error) {
    return null;
  }
};

export const getTopRoomAttendances =
  async (): Promise<TopRoomAttendancesModel | null> => {
    try {
      const response = await fetchWithSession(
        `${API_BASE_PATH}/dashboard/top-attendance-room`
      );

      if (response.ok) {
        const json = await response.json();
        return json.data as TopRoomAttendancesModel;
      }

      return null;
    } catch (error) {
      return null;
    }
  };
