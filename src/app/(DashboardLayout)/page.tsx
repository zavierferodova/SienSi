"use client";
import { Stack } from "@mui/material";
import PageContainer from "@/components/container/PageContainer";
import CameraCard from "@/components/dashboard/CameraCard";
// import GuestTable from "@/components/dashboard/GuestTable";
import DialogCustomizeGuest from "../../components/dialog/DialogCustomizeGuest";
import DialogQRGuest from "../../components/dialog/DialogQRGuest";
import ConsecutiveSnackbars from "../../components/dashboard/ConsecutiveSnackbars";
import { useDashboardController } from "../../controller/dashboard-controller";
import DialogQuestion from "../../components/dialog/DialogQuestion";
// import DialogDeleteGuest from "./components/dashboard/DialogDeleteGuest";

const Dashboard = () => {
  const [snackbarController, guestController] = useDashboardController();

  return (
    <>
      {/* <ConsecutiveSnackbars controller={snackbarController} /> */}
      {/* <DialogQuestion
        title="Hapus Tamu"
        message="Anda yakin ingin menghapus tamu ini?"
        open={guestController.openDeleteDialog}
        onClose={guestController.closeDeleteDialog}
        onAccept={guestController.acceptDeleteDialog}
      />
      <DialogQRGuest
        open={guestController.openQRDialog}
        qrCode={guestController.qrDialogLink}
        onClose={guestController.closeQRDialog}
      />
      <DialogCustomizeGuest
        open={guestController.openPaginationDialog}
        mode={guestController.paginationDialogMode}
        guest={guestController.editingGuest}
        onSave={(guest) => {
          if (guestController.paginationDialogMode == "add") {
            guestController.saveGuest(guest);
          } else {
            guestController.editGuest(guest);
          }
        }}
        onClose={guestController.handleCloseDialog}
      />
      */}
    </>
  );
};

export default Dashboard;
