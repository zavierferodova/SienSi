import * as React from "react";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import AttendanceModel from "@/model/attendance";
import { Box, Container } from "@mui/material";
import localDateFormatter from "@/utils/localDateFormatter";

type DialogDetailAttendanceProps = {
  open: boolean;
  onClose?: () => void;
  attendance?: AttendanceModel | null;
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DialogDetailAttendance({
  open,
  onClose,
  attendance,
}: DialogDetailAttendanceProps) {
  return (
    <React.Fragment>
      <Dialog
        fullScreen
        open={open}
        onClose={onClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={onClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Detail Kehadiran
            </Typography>
          </Toolbar>
        </AppBar>
        <Container sx={{ padding: 2 }}>
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight={600} fontSize={16}>
              Kode Tamu
            </Typography>
            <Typography variant="body1">
              {attendance?.guest.key ?? "-"}
            </Typography>
          </Box>
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight={600} fontSize={16}>
              Waktu Kehadiran
            </Typography>
            <Typography variant="body1">
              {(attendance?.time) ? localDateFormatter(new Date(attendance.time)) : "-"}
            </Typography>
          </Box>
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight={600} fontSize={16}>
              Nama Tamu
            </Typography>
            <Typography variant="body1">
              {attendance?.guest.name ?? "-"}
            </Typography>
          </Box>
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight={600} fontSize={16}>
              Jenis Kelamin
            </Typography>
            <Typography variant="body1">
              {attendance?.guest.gender
                ? attendance.guest.gender === "male"
                  ? "Laki-Laki"
                  : "Perempuan"
                : "-"}
            </Typography>
          </Box>
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight={600} fontSize={16}>
              Alamat
            </Typography>
            <Typography variant="body1">
              {attendance?.guest.address ?? "-"}
            </Typography>
          </Box>
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight={600} fontSize={16}>
              Email
            </Typography>
            <Typography variant="body1">
              {attendance?.guest.email ?? "-"}
            </Typography>
          </Box>
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight={600} fontSize={16}>
              No Telepon
            </Typography>
            <Typography variant="body1">
              {attendance?.guest.phone ?? "-"}
            </Typography>
          </Box>
        </Container>
      </Dialog>
    </React.Fragment>
  );
}
