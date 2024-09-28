import {
  addSession,
  deleteSession,
  getSessionPagination,
  SessionPaginationResponse,
  updateSession,
} from "@/data/session-provider";
import { useCallback, useEffect, useState } from "react";
import { ConsecutiveSnackbarsDispatcher } from "../components/dashboard/ConsecutiveSnackbars";
import { useDialogQuestion } from "../components/dialog/DialogQuestion";
import SessionModel from "@/model/session";

export function useSessionController(
  roomId: string,
  snackbarDispatcher: ConsecutiveSnackbarsDispatcher
) {
  const [openPaginationDialog, setOpenPaginationDialog] = useState(false);
  const [paginationDialogMode, setPaginationDialogMode] = useState<
    "add" | "edit"
  >("add");
  const [paginationData, setPaginationData] =
    useState<SessionPaginationResponse | null>(null);
  const [editingSession, setEditingSession] = useState<SessionModel | null>(
    null
  );
  const [paginationLimit, setPaginationLimit] = useState(10);
  const [paginationPage, setPaginationPage] = useState(1);
  const [paginationSearch, setPaginationSearch] = useState("");
  const dialogQuestion = useDialogQuestion();

  const handleOpenDialogAdd = () => {
    setPaginationDialogMode("add");
    setOpenPaginationDialog(true);
  };

  const handleOpenDialogEdit = (session: SessionModel) => {
    setPaginationDialogMode("edit");
    setOpenPaginationDialog(true);
    setEditingSession(session);
  };

  const handleCloseDialog = () => {
    setPaginationDialogMode("add");
    setOpenPaginationDialog(false);
    setEditingSession(null);
  };

  const getPaginationData = () => {
    let data;
    if (paginationData) {
      data = {
        page: paginationData.page,
        limit: paginationData.limit,
        total: paginationData.total,
        sessions: paginationData.sessions,
      };
    }

    return data;
  };

  const fetchPaginationData = async (
    page?: number,
    limit?: number,
    search?: string
  ) => {
    const response = await getSessionPagination(page, limit, search, roomId);
    setPaginationData(response);
  };

  const performFetchPagination = useCallback(() => {
    fetchPaginationData(paginationPage, paginationLimit, paginationSearch);
  }, [paginationPage, paginationLimit, paginationSearch]);

  const fetchAddSession = async (session: SessionModel) => {
    const response = await addSession(session, roomId);
    return response;
  };

  const fetchEditSession = async (session: SessionModel) => {
    const response = await updateSession(session, roomId);
    return response;
  };

  const fetchRemoveSession = async (id: string) => {
    const response = await deleteSession(id, roomId);
    return response;
  };

  const saveSession = async (session: SessionModel) => {
    snackbarDispatcher("Menambahkan tamu...", "info");
    const success = await fetchAddSession(session);
    if (success) {
      performFetchPagination();
      handleCloseDialog();
      snackbarDispatcher("Berhasil menambahkan tamu!", "success");
    } else {
      snackbarDispatcher("Gagal menambahkan tamu!", "error");
    }
  };

  const editSession = async (session: SessionModel) => {
    snackbarDispatcher("Mengedit tamu...", "info");
    const success = await fetchEditSession(session);
    if (success) {
      performFetchPagination();
      handleCloseDialog();
      snackbarDispatcher("Berhasil mengedit tamu!", "success");
    } else {
      snackbarDispatcher("Gagal mengedit tamu!", "error");
    }
  };

  const removeSession = async (id: string) => {
    dialogQuestion.handleOpen();
    dialogQuestion.subscribeAccept(async () => {
      snackbarDispatcher("Menghapus tamu...", "info");
      const success = await fetchRemoveSession(id);
      if (success) {
        performFetchPagination();
        snackbarDispatcher("Berhasil menghapus tamu!", "success");
      } else {
        snackbarDispatcher("Gagal menghapus tamu!", "error");
      }
    });
  };

  useEffect(() => {
    performFetchPagination();
  }, [performFetchPagination]);

  return {
    paginationResponseData: paginationData,
    openDeleteDialog: dialogQuestion.open,
    closeDeleteDialog: dialogQuestion.handleClose,
    acceptDeleteDialog: dialogQuestion.handleAccept,
    openPaginationDialog,
    paginationDialogMode,
    handleOpenDialogAdd,
    handleOpenDialogEdit,
    handleCloseDialog,
    editingSession,
    saveSession,
    editSession,
    removeSession,
    getPaginationData,
    setPaginationPage,
    setPaginationLimit,
    setPaginationSearch,
  };
}
