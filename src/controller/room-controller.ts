import { useCallback, useEffect, useState } from "react";
import { ConsecutiveSnackbarsDispatcher } from "../components/dashboard/ConsecutiveSnackbars";
import { useDialogQuestion } from "../components/dialog/DialogQuestion";
import { addRoom, deleteRoom, getRoomPagination, RoomPaginationResponse, updateRoom } from "@/data/room-provider";
import RoomModel from "@/model/room";

export function useRoomController(
  snackbarDispatcher: ConsecutiveSnackbarsDispatcher
) {
  const [openQRDialog, setOpenQRDialog] = useState(false);
  const [openPaginationDialog, setOpenPaginationDialog] = useState(false);
  const [paginationDialogMode, setPaginationDialogMode] = useState<
    "add" | "edit"
  >("add");
  const [paginationData, setPaginationData] =
    useState<RoomPaginationResponse | null>(null);
  const [editingRoom, setEditingRoom] = useState<RoomModel | null>(null);
  const [paginationLimit, setPaginationLimit] = useState(10);
  const [paginationPage, setPaginationPage] = useState(1);
  const [paginationSearch, setPaginationSearch] = useState("");
  const dialogQuestion = useDialogQuestion();

  const handleOpenDialogAdd = () => {
    setPaginationDialogMode("add");
    setOpenPaginationDialog(true);
  };

  const handleOpenDialogEdit = (room: RoomModel) => {
    setPaginationDialogMode("edit");
    setOpenPaginationDialog(true);
    setEditingRoom(room);
  };

  const handleCloseDialog = () => {
    setPaginationDialogMode("add");
    setOpenPaginationDialog(false);
    setEditingRoom(null);
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
        rooms: paginationData.rooms,
      };
    }

    return data;
  };

  const fetchPaginationData = async (
    page?: number,
    limit?: number,
    search?: string
  ) => {
    const response = await getRoomPagination(page, limit, search);
    setPaginationData(response);
  };

  const performFetchPagination = useCallback(() => {
    fetchPaginationData(paginationPage, paginationLimit, paginationSearch);
  }, [paginationPage, paginationLimit, paginationSearch]);

  const fetchAddRoom = async (room: RoomModel) => {
    const response = await addRoom(room);
    return response;
  };

  const fetchEditRoom = async (room: RoomModel, roomId: string) => {
    const response = await updateRoom(room, roomId);
    return response;
  };

  const fetchRemoveRoom = async (id: string) => {
    const response = await deleteRoom(id);
    return response;
  };

  const saveRoom = async (room: RoomModel) => {
    snackbarDispatcher("Menambahkan ruangan...", "info");
    const success = await fetchAddRoom(room);
    if (success) {
      performFetchPagination();
      handleCloseDialog();
      snackbarDispatcher("Berhasil menambahkan ruangan!", "success");
    } else {
      snackbarDispatcher("Gagal menambahkan ruangan!", "error");
    }
  };

  const editRoom = async (room: RoomModel, id: string) => {
    snackbarDispatcher("Mengedit ruangan...", "info");
    const success = await fetchEditRoom(room, id);
    if (success) {
      performFetchPagination();
      handleCloseDialog();
      snackbarDispatcher("Berhasil mengedit ruangan!", "success");
    } else {
      snackbarDispatcher("Gagal mengedit ruangan!", "error");
    }
  };

  const removeGuest = async (id: string) => {
    dialogQuestion.handleOpen();
    dialogQuestion.subscribeAccept(async () => {
      snackbarDispatcher("Menghapus ruangan...", "info");
      const success = await fetchRemoveRoom(id);
      if (success) {
        performFetchPagination();
        snackbarDispatcher("Berhasil menghapus ruangan!", "success");
      } else {
        snackbarDispatcher("Gagal menghapus ruangan!", "error");
      }
    });
  };

  useEffect(() => {
    performFetchPagination();
  }, [performFetchPagination]);

  return {
    paginationResponseData: paginationData,
    openQRDialog,
    closeQRDialog: handleOpenQRDialog,
    openDeleteDialog: dialogQuestion.open,
    closeDeleteDialog: dialogQuestion.handleClose,
    acceptDeleteDialog: dialogQuestion.handleAccept,
    openPaginationDialog,
    paginationDialogMode,
    handleOpenDialogAdd,
    handleOpenDialogEdit,
    handleCloseDialog,
    editingRoom,
    saveRoom,
    editRoom,
    removeGuest,
    getPaginationData,
    setPaginationPage,
    setPaginationLimit,
    setPaginationSearch,
  };
}
