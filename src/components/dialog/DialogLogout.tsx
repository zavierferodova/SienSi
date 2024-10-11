import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { removeSessionFromClient } from "@/auth/auth";
import { Logout } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import React from "react";

export default function DialogLogout() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        fullWidth
        onClick={handleClickOpen}
        sx={{
          textAlign: "left",
        }}
      >
        <Logout sx={{ minWidth: "36px", p: "3px 0", color: "inherit" }} />
        Logout
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Konfirmasi Logout</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Apakah Anda yakin ingin logout? Ini akan mengakhiri sesi Anda saat
            ini.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={handleClose}>
            Batal
          </Button>
          <Button
            autoFocus
            onClick={() => {
              removeSessionFromClient(router);
              handleClose();
            }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
