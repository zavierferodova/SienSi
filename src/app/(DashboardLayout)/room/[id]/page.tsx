"use client";
import PageContainer from "@/components/container/PageContainer";
import ConsecutiveSnackbars, {
  useConsecutiveSnackbars,
} from "@/components/dashboard/ConsecutiveSnackbars";
import DialogCustomizeGuest from "@/components/dialog/DialogCustomizeGuest";
import DialogCustomizeSession from "@/components/dialog/DialogCustomizeSession";
import DialogQRGuest from "@/components/dialog/DialogQRGuest";
import DialogDelete from "@/components/dialog/DialogQuestion";
import GuestTable from "@/components/table/GuestTable";
import SessionTable from "@/components/table/SessionTable";
import { useGuestController } from "@/controller/guest-controller";
import { useSessionController } from "@/controller/session-controller";
import { getRoom } from "@/data/room-provider";
import { useRoomStore } from "@/store";
import { Button, Card, IconButton, Typography } from "@mui/material";
import { IconShare } from "@tabler/icons-react";
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
      <PageContainer title="Siensi" description="presensi">
        <div className="flex flex-col items-center">
          <div className="grid grid-cols-1 md:grid-cols-3 items-start mb-10 gap-2 w-full max-w-[900px] max-h-[500px]">
            <Card
              sx={{
                width: "100%",
                height: "100%",
                padding: 2,
              }}
            >
              <div className="col-span-1 flex justify-between">
                <Typography variant="subtitle1" fontSize={18} fontWeight={600}>
                  {roomData?.name}
                </Typography>
              </div>
              <Typography variant="body2" color="gray">
                {roomData?.description}
              </Typography>
            </Card>
            <div className="col-span-1 md:col-span-2">
              <SessionTable
                paginationData={sessionController.getPaginationData()}
                onAddClicked={sessionController.handleOpenDialogAdd}
                onEditClicked={sessionController.handleOpenDialogEdit}
                onSearching={(query) =>
                  sessionController.setPaginationSearch(query)
                }
                onPageChanged={(page) => sessionController.setPaginationPage(page)}
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
            </div>
          </div>
          <GuestTable
            paginationData={guestController.getPaginationData()}
            onAddClicked={guestController.handleOpenDialogAdd}
            onEditClicked={guestController.handleOpenDialogEdit}
            onSearching={(query) => guestController.setPaginationSearch(query)}
            onPageChanged={(page) => guestController.setPaginationPage(page)}
            onDeleteClicked={(guest) => guestController.removeGuest(guest)}
            onQRImageClicked={guestController.viewGuestQRImage}
            onRowsPerPageChange={(limit) =>
              guestController.setPaginationLimit(limit)
            }
          />
          </div>
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
