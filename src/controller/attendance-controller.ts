import { ConsecutiveSnackbarsDispatcher } from "@/components/dashboard/ConsecutiveSnackbars";
import { useDialogQuestion } from "@/components/dialog/DialogQuestion";
import {
  attendanceCheck,
  AttendancePaginationResponse,
  getAttendancePagination,
  getExcelAttendance,
} from "@/data/attendance-provider";
import AttendanceModel from "@/model/attendance";
import { useCallback, useEffect, useState } from "react";

export function useAttendanceController(
  snackbarDispatcher: ConsecutiveSnackbarsDispatcher,
  roomId: string,
  sessionId: string
) {
  const [paginationData, setPaginationData] =
    useState<AttendancePaginationResponse | null>(null);
  const [paginationLimit, setPaginationLimit] = useState(10);
  const [paginationPage, setPaginationPage] = useState(1);
  const [paginationSearch, setPaginationSearch] = useState("");
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [detailAttendance, setDetailAttendance] =
    useState<AttendanceModel | null>(null);
  const dialogQuestion = useDialogQuestion();

  const getPaginationData = () => {
    let data;
    if (paginationData) {
      data = {
        page: paginationData.page,
        limit: paginationData.limit,
        total: paginationData.total,
        attendances: paginationData.attendances,
      };
    }

    return data;
  };

  const fetchPaginationData = async (
    page?: number,
    limit?: number,
    search?: string
  ) => {
    const response = await getAttendancePagination(
      roomId,
      sessionId,
      page,
      limit,
      search
    );
    setPaginationData(response);
  };

  const performFetchPagination = useCallback(() => {
    fetchPaginationData(paginationPage, paginationLimit, paginationSearch);
  }, [paginationPage, paginationLimit, paginationSearch]);

  const fetchAttendanceCheck = async (guestKey: string) => {
    const response = await attendanceCheck(guestKey, roomId, sessionId);
    return response;
  };

  const fetchExcelAttendance = async () => {
    const response = await getExcelAttendance(roomId, sessionId);
    return response;
  };

  const checkAttendance = async (guestKey: string) => {
    snackbarDispatcher("Melakukan presensi...", "info");
    const response = await fetchAttendanceCheck(guestKey);
    if (response === "success") {
      snackbarDispatcher("Berhasil melakukan presensi!", "success");
      performFetchPagination();
    } else if (response === "recorded") {
      snackbarDispatcher("Tamu telah melakukan presensi!", "info");
    } else {
      snackbarDispatcher("Gagal melakukan presensi!", "error");
    }
  };

  const downloadExcelAttendances = async () => {
    const blob = await fetchExcelAttendance();
    if (blob) {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "attendance.xlsx";
      a.click();
    }
  };

  const showDetailAttendance = (attendance: AttendanceModel) => {
    setDetailAttendance(attendance);
    setOpenDetailDialog(true);
  };

  const closeDetailDialog = () => {
    setOpenDetailDialog(false);
    setDetailAttendance(null);
  };

  useEffect(() => {
    performFetchPagination();
  }, [performFetchPagination]);

  return {
    openClearDialog: dialogQuestion.open,
    closeClearDialog: dialogQuestion.handleClose,
    acceptClearDialog: dialogQuestion.handleAccept,
    refreshPagination: performFetchPagination,
    openDetailDialog,
    showDetailAttendance,
    detailAttendance,
    closeDetailDialog,
    getPaginationData,
    setPaginationPage,
    setPaginationLimit,
    setPaginationSearch,
    checkAttendance,
    downloadExcelAttendances,
  };
}
