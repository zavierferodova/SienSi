/* eslint-disable @next/next/no-img-element */
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, styled } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));

type DialogQRGuestProps = {
    open: boolean;
    onClose: () => void;
    qrCode: string;
};

const DialogQRGuest = ({ open, onClose, qrCode }: DialogQRGuestProps) => {
    return (
        <BootstrapDialog
        onClose={() => {
            if (onClose) {
                onClose();
            }
        }}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Kode QR Tamu
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => {
            if (onClose) {
                onClose();
            }
          }}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
            <Box>
                <img src={qrCode} alt="QR Code" />
            </Box>
        </DialogContent>
        <DialogActions>
          <Button href={qrCode} download={"Presence-QR.png"}>
            Download
          </Button>
        </DialogActions>
      </BootstrapDialog>
    );
}

export default DialogQRGuest;
