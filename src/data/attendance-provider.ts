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
  guestKey: string
): Promise<AttendanceResponse> => {
  try {
    const response = await fetchWithSession(API_BASE_PATH + "/presence", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ guestKey }),
    });

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

export const getAttendancePagination = async ({
  page = 1,
  limit = 10,
  search = "",
}): Promise<AttendancePaginationResponse | null> => {
  try {
    const response = await fetchWithSession(
      API_BASE_PATH + `/presence?page=${page}&limit=${limit}&search=${search}`
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

export const getExcelAttendance = async (): Promise<Blob | null> => {
  try {
    const response = await fetchWithSession(
      API_BASE_PATH + "/presence/export-excel"
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

export const clearAttendances = async (): Promise<boolean> => {
  try {
    const response = await fetchWithSession(API_BASE_PATH + "/presence", {
      method: "DELETE",
    });

    return response.ok;
  } catch (error) {
    return false;
  }
};
