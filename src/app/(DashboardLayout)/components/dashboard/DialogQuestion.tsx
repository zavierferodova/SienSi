import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useState } from "react";

export type DialogQuestion = {
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onAccept: () => void;
};

export const useDialogQuestion = () => {
  const [open, setOpen] = useState(false);
  const [acceptObservers, setAcceptObservers] = useState<Set<() => void>>(new Set());

  const clearObservers = () => {
    setAcceptObservers(new Set());
  }

  const subscribeAccept = (callback: () => void) => {
    setAcceptObservers((prev) => {
      const next = new Set(prev);
      next.add(callback);
      return next;
    })
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    clearObservers();
  };
  
  const handleAccept = () => {
    acceptObservers.forEach((callback) => callback());
    clearObservers();
    handleClose();
  }

  return { open, handleOpen, handleClose, handleAccept, subscribeAccept };
};

const DialogDeleteGuest = ({
  open,
  title,
  message,
  onClose,
  onAccept,
}: DialogQuestion) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Tidak
        </Button>
        <Button onClick={onAccept} color="primary">
          Ya
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogDeleteGuest;
