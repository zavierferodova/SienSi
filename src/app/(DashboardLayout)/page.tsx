"use client";
import { Stack } from "@mui/material";
import PageContainer from "@/components/container/PageContainer";
import CameraCard from "@/components/dashboard/CameraCard";
import GuestTable from "@/components/dashboard/GuestTable";
import AttendanceTable from "../../components/dashboard/AttendanceTable";
import DialogCustomizeGuest from "../../components/dashboard/DialogCustomizeGuest";
import DialogQRGuest from "../../components/dashboard/DialogQRGuest";
import ConsecutiveSnackbars from "../../components/dashboard/ConsecutiveSnackbars";
import { useDashboardController } from "../../controller/dashboard-controller";
import DialogQuestion from "../../components/dashboard/DialogQuestion";
import DialogDetailAttendance from "../../components/dashboard/DialogDetailAttendance";
// import DialogDeleteGuest from "./components/dashboard/DialogDeleteGuest";

const Dashboard = () => {
  const [snackbarController, guestController, attendanceController] =
    useDashboardController();

  return (
    <>
      <PageContainer title="Dashboard" description="this is Dashboard">
        <Stack direction="column" gap={3}>
          <div className="flex flex-col-reverse md:flex-row gap-4">
            <div className="basis-full md:basis-8/12">
              <GuestTable
                paginationData={guestController.getPaginationData()}
                onPageChanged={(page) =>
                  guestController.setPaginationPage(page)
                }
                onRowsPerPageChange={(limit) =>
                  guestController.setPaginationLimit(limit)
                }
                onSearching={(query) =>
                  guestController.setPaginationSearch(query)
                }
                onAddClicked={guestController.handleOpenDialogAdd}
                onEditClicked={(guest) =>
                  guestController.handleOpenDialogEdit(guest)
                }
                onDeleteClicked={(id) => guestController.removeGuest(id)}
                onQRImageClicked={(id) => guestController.viewGuestQRImage(id)}
              />
            </div>
            <div className="basis-full md:basis-4/12">
              <CameraCard
                onQRScanned={(qrCode) => {
                  attendanceController.checkAttendance(qrCode);
                }}
              />
            </div>
          </div>
          <div className="flex flex-col-reverse md:flex-row gap-4">
            <div className="basis-full md:basis-8/12">
              <AttendanceTable
                paginationData={attendanceController.getPaginationData()}
                onPageChanged={(page) =>
                  attendanceController.setPaginationPage(page)
                }
                onRowsPerPageChange={(limit) =>
                  attendanceController.setPaginationLimit(limit)
                }
                onSearching={(query) =>
                  attendanceController.setPaginationSearch(query)
                }
                onDownloadExcelClicked={() =>
                  attendanceController.downloadExcelAttendances()
                }
                onViewDetailClicked={(attendance) =>
                  attendanceController.showDetailAttendance(attendance)
                }
                onClearClicked={() =>
                  attendanceController.clearAllAttendances()
                }
              />
            </div>
          </div>
        </Stack>
      </PageContainer>
      <ConsecutiveSnackbars controller={snackbarController} />
      <DialogQuestion
        title="Hapus Tamu"
        message="Anda yakin ingin menghapus tamu ini?"
        open={guestController.openDeleteDialog}
        onClose={guestController.closeDeleteDialog}
        onAccept={guestController.acceptDeleteDialog}
      />
      <DialogQuestion
        title="Bersihkan Data Kehadiran"
        message="Anda yakin ingin menghapus semua data kehadiran?"
        open={attendanceController.openClearDialog}
        onClose={attendanceController.closeClearDialog}
        onAccept={attendanceController.acceptClearDialog}
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
      <DialogDetailAttendance
        open={attendanceController.openDetailDialog}
        onClose={attendanceController.closeDetailDialog}
        attendance={attendanceController.detailAttendance}
      />
    </>
  );
};

export default Dashboard;
