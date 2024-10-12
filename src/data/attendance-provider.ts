import { fetchWithSession } from "@/auth/auth";
import { API_BASE_PATH } from "@/constant/constant";
import AttendanceModel from "@/model/attendance";

type AttendanceResponse = "success" | "recorded" | "error";

export type AttendancePaginationResponse = {
  attendances: AttendanceModel[];
  total: number;
  page: number;
  limit: number;
};

export const attendanceCheck = async (
  guestKey: string,
  roomId: string,
  sessionId: string
): Promise<AttendanceResponse> => {
  try {
    const response = await fetchWithSession(
      `${API_BASE_PATH}/room/${roomId}/session/${sessionId}/presence`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ guestKey }),
      }
    );

    if (response.ok) {
      return "success";
    } else if (response.status === 409) {
      return "recorded";
    } else {
      return "error";
    }
  } catch (error) {
    return "error";
  }
};

export const getAttendancePagination = async (
  roomId: string,
  sessionId: string,
  page = 1,
  limit = 10,
  search = ""
): Promise<AttendancePaginationResponse | null> => {
  try {
    const response = await fetchWithSession(
      `${API_BASE_PATH}/room/${roomId}/session/${sessionId}/presence?page=${page}&limit=${limit}&search=${search}`
    );
    if (response.ok) {
      const json = await response.json();
      return json.data as AttendancePaginationResponse;
    }

    return null;
  } catch (error) {
    return null;
  }
};

export const getExcelAttendance = async (
  roomId: string,
  sessionId: string
): Promise<Blob | null> => {
  try {
    const response = await fetchWithSession(
      `${API_BASE_PATH}/room/${roomId}/session/${sessionId}/excel`
    );

    if (response.ok) {
      const blob = await response.blob();
      return blob;
    }

    return null;
  } catch (error) {
    return null;
  }
};
