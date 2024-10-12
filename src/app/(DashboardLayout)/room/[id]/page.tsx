"use client";
import PageContainer from "@/components/container/PageContainer";
import ConsecutiveSnackbars, {
  useConsecutiveSnackbars,
} from "@/components/dashboard/ConsecutiveSnackbars";
import DialogCustomizeGuest from "@/components/dialog/DialogCustomizeGuest";
import DialogCustomizeSession from "@/components/dialog/DialogCustomizeSession";
import DialogQRGuest from "@/components/dialog/DialogQRGuest";
import DialogDelete from "@/components/dialog/DialogQuestion";
import TableSkeleton from "@/components/skeleton/table-skeleton";
import GuestTable from "@/components/table/GuestTable";
import SessionTable from "@/components/table/SessionTable";
import { useGuestController } from "@/controller/guest-controller";
import { useSessionController } from "@/controller/session-controller";
import { getRoom } from "@/data/room-provider";
import { useRoomStore } from "@/store";
import { Card, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export type RoomData = {
  name: string;
  description: string;
};

export default function DetailRoomPage({ params }: { params: { id: string } }) {
  const [openSnackbar, snackbarController] = useConsecutiveSnackbars();
  const [roomData, setRoomData] = useState<RoomData | undefined>(undefined);
  const guestController = useGuestController(params.id, openSnackbar);
  const sessionController = useSessionController(params.id, openSnackbar);
  const roomStore = useRoomStore();
  useEffect(() => {
    const getRoomData = async (): Promise<RoomData | undefined> => {
      if (roomStore.room) {
        setRoomData({
          name: roomStore.room.name,
          description: roomStore.room.description,
        });
      } else {
        const data = await getRoom(params.id);
        if (data && data.room) {
          roomStore.setRoom(data.room);
          setRoomData({
            name: data.room.name,
            description: data.room.description,
          });
        }
      }
      return undefined;
    };
    getRoomData();
  }, []);
  return (
    <>
      <div className="grid md:grid-cols-3 items-start mb-10 gap-6 max-w-[900px]">
        {roomData ? (
          <Card
            sx={{
              height: "100%",
              maxHeight: "500px",
              maxWidth: "900px",
              padding: 2,
              gridColumn: "span 2/2",
            }}
          >
            <div className="flex justify-between">
              <Typography variant="subtitle1" fontSize={18} fontWeight={600}>
                {roomData?.name}
              </Typography>
            </div>
            <Typography variant="body2" color="gray">
              {roomData?.description}
            </Typography>
          </Card>
        ) : (
          <TableSkeleton />
        )}
        <div className="col-span-2">
          {sessionController.getPaginationData() ? (
            <SessionTable
              paginationData={sessionController.getPaginationData()}
              onAddClicked={sessionController.handleOpenDialogAdd}
              onEditClicked={sessionController.handleOpenDialogEdit}
              onSearching={(query) =>
                sessionController.setPaginationSearch(query)
              }
              onPageChanged={(page) =>
                sessionController.setPaginationPage(page)
              }
              onRowsPerPageChange={(limit) =>
                sessionController.setPaginationLimit(limit)
              }
              onViewDetailClicked={(id) =>
                sessionController.viewSessionDetail(id)
              }
              onDeleteClicked={(id) => sessionController.removeSession(id)}
              onDownloadExcelClicked={(id) =>
                sessionController.downloadExcelAttendances(id)
              }
            />
          ) : (
            <TableSkeleton />
          )}
        </div>
      </div>
      <PageContainer title="Siensi" description="presensi">
        {guestController.getPaginationData() ? (
          <GuestTable
            paginationData={guestController.getPaginationData()}
            onAddClicked={guestController.handleOpenDialogAdd}
            onSendAllQrCode={guestController.handleSendAllQrCode}
            onEditClicked={guestController.handleOpenDialogEdit}
            onSearching={(query) => guestController.setPaginationSearch(query)}
            onPageChanged={(page) => guestController.setPaginationPage(page)}
            onDeleteClicked={(guest) => guestController.removeGuest(guest)}
            onQRImageClicked={guestController.viewGuestQRImage}
            onRowsPerPageChange={(limit) =>
              guestController.setPaginationLimit(limit)
            }
          />
        ) : (
          <TableSkeleton />
        )}
      </PageContainer>

      <ConsecutiveSnackbars controller={snackbarController} />
      <DialogDelete
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

      <ConsecutiveSnackbars controller={snackbarController} />
      <DialogDelete
        title="Hapus Sesi"
        message="Anda yakin ingin menghapus sesi ini?"
        open={sessionController.openDeleteDialog}
        onClose={sessionController.closeDeleteDialog}
        onAccept={sessionController.acceptDeleteDialog}
      />
      <DialogCustomizeSession
        roomId={params.id}
        open={sessionController.openPaginationDialog}
        mode={sessionController.paginationDialogMode}
        session={sessionController.editingSession}
        onSave={(session) => {
          if (sessionController.paginationDialogMode == "add") {
            sessionController.saveSession(session);
          } else {
            sessionController.editSession(session);
          }
        }}
        onClose={sessionController.handleCloseDialog}
      />
    </>
  );
}
