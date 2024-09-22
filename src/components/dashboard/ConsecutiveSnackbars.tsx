import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState, useEffect } from "react";
import { Alert, AlertColor, Portal } from "@mui/material";

export interface SnackbarMessage {
  severity: AlertColor;
  message: string;
  key: number;
}

export type ConsecutiveSnackbarsController = {
  open: boolean;
  messageInfo: SnackbarMessage | undefined;
  handleClose: (event: React.SyntheticEvent | Event, reason?: string) => void;
  handleExited: () => void;
};

export type ConsecutiveSnackbarsProps = {
  controller: ConsecutiveSnackbarsController;
};

export type ConsecutiveSnackbarsDispatcher = (
  message: string,
  severity: AlertColor
) => void;

export const useConsecutiveSnackbars = (): [
  ConsecutiveSnackbarsDispatcher,
  ConsecutiveSnackbarsController
] => {
  const [snackPack, setSnackPack] = useState<readonly SnackbarMessage[]>([]);
  const [open, setOpen] = useState(false);
  const [messageInfo, setMessageInfo] = useState<SnackbarMessage | undefined>(
    undefined
  );

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleExited = () => {
    setMessageInfo(undefined);
  };

  const openSnackbar: ConsecutiveSnackbarsDispatcher = (
    message: string,
    severity: AlertColor
  ) => {
    setSnackPack((prev) => [
      ...prev,
      { message, key: new Date().getTime(), severity },
    ]);
  };

  useEffect(() => {
    if (snackPack.length && !messageInfo) {
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpen(true);
    } else if (snackPack.length && messageInfo && open) {
      setOpen(false);
    }
  }, [snackPack, messageInfo, open]);

  const controller: ConsecutiveSnackbarsController = {
    open,
    messageInfo,
    handleClose,
    handleExited,
  };

  return [openSnackbar, controller];
};

export default function ConsecutiveSnackbars({
  controller,
}: ConsecutiveSnackbarsProps) {
  return (
    <Portal>
      <Snackbar
        key={controller.messageInfo ? controller.messageInfo.key : undefined}
        open={controller.open}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        autoHideDuration={6000}
        onClose={controller.handleClose}
        TransitionProps={{ onExited: controller.handleExited }}
        message={
          controller.messageInfo ? controller.messageInfo.message : undefined
        }
        action={
          <React.Fragment>
            <IconButton
              aria-label="close"
              color="inherit"
              sx={{ p: 0.5 }}
              onClick={controller.handleClose}
            >
              <CloseIcon />
            </IconButton>
          </React.Fragment>
        }
      >
        <Alert
          onClose={controller.handleClose}
          severity={controller.messageInfo?.severity ?? "info"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {controller.messageInfo ? controller.messageInfo.message : undefined}
        </Alert>
      </Snackbar>
    </Portal>
  );
}
