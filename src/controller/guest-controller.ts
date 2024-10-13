import {
  addGuest,
  deleteGuest,
  getGuestPagination,
  getGuestQRKey,
  GuestPaginationResponse,
  sendAllQrCode,
  updateGuest,
} from "@/data/guest-provider";
import GuestModel from "@/model/guest";
import { useCallback, useEffect, useState } from "react";
import { ConsecutiveSnackbarsDispatcher } from "../components/dashboard/ConsecutiveSnackbars";
import { useDialogQuestion } from "../components/dialog/DialogQuestion";

export function useGuestController(
  roomId: string,
  snackbarDispatcher: ConsecutiveSnackbarsDispatcher
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

  const handleSendAllQrCode = async () => {
    const response = await sendAllQrCode(roomId);
    if (response) {
      snackbarDispatcher("Berhasil megirim email QR code!", "success");
    }
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
    const response = await getGuestPagination(roomId, page, limit, search);
    setPaginationData(response);
  };

  const performFetchPagination = useCallback(() => {
    fetchPaginationData(paginationPage, paginationLimit, paginationSearch);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationPage, paginationLimit, paginationSearch]);

  const fetchAddGuest = async (guest: GuestModel) => {
    const response = await addGuest(guest, roomId);
    return response;
  };

  const fetchEditGuest = async (guest: GuestModel) => {
    const response = await updateGuest(guest, roomId);
    return response;
  };

  const fetchRemoveGuest = async (id: string) => {
    const response = await deleteGuest(id, roomId);
    return response;
  };

  const fetchGuestQRImage = async (id: string) => {
    const response = await getGuestQRKey(id, roomId);
    return response;
  };

  const saveGuest = async (guest: GuestModel) => {
    snackbarDispatcher("Menambahkan tamu...", "info");
    const success = await fetchAddGuest(guest);
    if (success) {
      performFetchPagination();
      handleCloseDialog();
      snackbarDispatcher("Berhasil menambahkan tamu!", "success");
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
    handleSendAllQrCode,
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
