import {
  attendanceCheck,
  AttendancePaginationResponse,
  clearAttendances,
  getAttendancePagination,
  getExcelAttendance,
} from "@/data/attendance-provider";
import {
  addGuest,
  deleteGuest,
  getGuestPagination,
  getGuestQRKey,
  GuestPaginationResponse,
  updateGuest,
} from "@/data/guest-provider";
import GuestModel from "@/model/guest";
import { useCallback, useEffect, useState } from "react";
import {
  ConsecutiveSnackbarsController,
  ConsecutiveSnackbarsDispatcher,
  useConsecutiveSnackbars,
} from "../components/dashboard/ConsecutiveSnackbars";
import { useDialogQuestion } from "../components/dashboard/DialogQuestion";
import AttendanceModel from "@/model/attendance";

type GuestController = ReturnType<typeof useGuestController>;

type AttendanceController = ReturnType<typeof useAttendanceController>;

export const useDashboardController = (): [
  ConsecutiveSnackbarsController,
  GuestController,
  AttendanceController
] => {
  const [openSnackbar, snackbarController] = useConsecutiveSnackbars();
  const attendanceController = useAttendanceController(openSnackbar);
  const guestController = useGuestController(
    openSnackbar,
    attendanceController.refreshPagination
  );
  return [snackbarController, guestController, attendanceController];
};

export function useGuestController(
  snackbarDispatcher: ConsecutiveSnackbarsDispatcher,
  refreshAttendances: () => void
) {
  const [openQRDialog, setOpenQRDialog] = useState(false);
  const [openPaginationDialog, setOpenPaginationDialog] = useState(false);
  const [qrDialogLink, setQRDialogLink] = useState<string>("");
  const [paginationDialogMode, setPaginationDialogMode] = useState<
    "add" | "edit"
  >("add");
  const [paginationData, setPaginationData] =
    useState<GuestPaginationResponse | null>(null);
  const [editingGuest, setEditingGuest] = useState<GuestModel | null>(null);
  const [paginationLimit, setPaginationLimit] = useState(10);
  const [paginationPage, setPaginationPage] = useState(1);
  const [paginationSearch, setPaginationSearch] = useState("");
  const dialogQuestion = useDialogQuestion();

  const handleOpenDialogAdd = () => {
    setPaginationDialogMode("add");
    setOpenPaginationDialog(true);
  };

  const handleOpenDialogEdit = (guest: GuestModel) => {
    setPaginationDialogMode("edit");
    setOpenPaginationDialog(true);
    setEditingGuest(guest);
  };

  const handleCloseDialog = () => {
    setPaginationDialogMode("add");
    setOpenPaginationDialog(false);
    setEditingGuest(null);
  };

  const handleOpenQRDialog = () => {
    setOpenQRDialog(!openQRDialog);
  };

  const getPaginationData = () => {
    let data;
    if (paginationData) {
      data = {
        page: paginationData.page,
        limit: paginationData.limit,
        total: paginationData.total,
        guests: paginationData.guests,
      };
    }

    return data;
  };

  const fetchPaginationData = async (
    page?: number,
    limit?: number,
    search?: string
  ) => {
    const response = await getGuestPagination({
      page: page,
      limit: limit,
      search: search,
    });
    setPaginationData(response);
  };

  const performFetchPagination = useCallback(() => {
    fetchPaginationData(paginationPage, paginationLimit, paginationSearch);
  }, [paginationPage, paginationLimit, paginationSearch]);

  const fetchAddGuest = async (guest: GuestModel) => {
    const response = await addGuest(guest);
    return response;
  };

  const fetchEditGuest = async (guest: GuestModel) => {
    const response = await updateGuest(guest);
    return response;
  };

  const fetchRemoveGuest = async (id: string) => {
    const response = await deleteGuest(id);
    return response;
  };

  const fetchGuestQRImage = async (id: string) => {
    const response = await getGuestQRKey(id);
    return response;
  };

  const saveGuest = async (guest: GuestModel) => {
    snackbarDispatcher("Menambahkan tamu...", "info");
    const success = await fetchAddGuest(guest);
    if (success) {
      performFetchPagination();
      handleCloseDialog();
      snackbarDispatcher("Berhasil menambahkan tamu!", "success");
      refreshAttendances();
    } else {
      snackbarDispatcher("Gagal menambahkan tamu!", "error");
    }
  };

  const editGuest = async (guest: GuestModel) => {
    snackbarDispatcher("Mengedit tamu...", "info");
    const success = await fetchEditGuest(guest);
    if (success) {
      performFetchPagination();
      handleCloseDialog();
      snackbarDispatcher("Berhasil mengedit tamu!", "success");
      refreshAttendances();
    } else {
      snackbarDispatcher("Gagal mengedit tamu!", "error");
    }
  };

  const removeGuest = async (id: string) => {
    dialogQuestion.handleOpen();
    dialogQuestion.subscribeAccept(async () => {
      snackbarDispatcher("Menghapus tamu...", "info");
      const success = await fetchRemoveGuest(id);
      if (success) {
        performFetchPagination();
        snackbarDispatcher("Berhasil menghapus tamu!", "success");
        refreshAttendances();
      } else {
        snackbarDispatcher("Gagal menghapus tamu!", "error");
      }
    });
  };

  const viewGuestQRImage = async (id: string) => {
    const imageLink = await fetchGuestQRImage(id);
    if (imageLink) {
      handleOpenQRDialog();
      setQRDialogLink(imageLink);
    } else {
      setQRDialogLink("");
    }
  };

  useEffect(() => {
    performFetchPagination();
  }, [performFetchPagination]);

  return {
    paginationResponseData: paginationData,
    openQRDialog,
    qrDialogLink,
    viewGuestQRImage,
    closeQRDialog: handleOpenQRDialog,
    openDeleteDialog: dialogQuestion.open,
    closeDeleteDialog: dialogQuestion.handleClose,
    acceptDeleteDialog: dialogQuestion.handleAccept,
    openPaginationDialog,
    paginationDialogMode,
    handleOpenDialogAdd,
    handleOpenDialogEdit,
    handleCloseDialog,
    editingGuest,
    saveGuest,
    editGuest,
    removeGuest,
    getPaginationData,
    setPaginationPage,
    setPaginationLimit,
    setPaginationSearch,
  };
}

function useAttendanceController(
  snackbarDispatcher: ConsecutiveSnackbarsDispatcher
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
    const response = await getAttendancePagination({
      page: page,
      limit: limit,
      search: search,
    });
    setPaginationData(response);
  };

  const performFetchPagination = useCallback(() => {
    fetchPaginationData(paginationPage, paginationLimit, paginationSearch);
  }, [paginationPage, paginationLimit, paginationSearch]);

  const fetchAttendanceCheck = async (guestKey: string) => {
    const response = await attendanceCheck(guestKey);
    return response;
  };

  const fetchExcelAttendance = async () => {
    const response = await getExcelAttendance();
    return response;
  };

  const fetchClearAttendances = async () => {
    const response = await clearAttendances();
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

  const clearAllAttendances = async () => {
    dialogQuestion.handleOpen();
    dialogQuestion.subscribeAccept(async () => {
      snackbarDispatcher("Menghapus data kehadiran...", "info");
      const response = await fetchClearAttendances();
      if (response) {
        performFetchPagination();
        snackbarDispatcher(
          "Berhasil menghapus semua data kehadiran!",
          "success"
        );
      }
    });
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
    clearAllAttendances,
  };
}
