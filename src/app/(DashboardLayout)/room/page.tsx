"use client";
import PageContainer from "@/components/container/PageContainer";
import ConsecutiveSnackbars, { useConsecutiveSnackbars } from "@/components/dashboard/ConsecutiveSnackbars";
import DialogCustomizeRoom from "@/components/dialog/DialogCustomizeRoom";
import DialogDelete from "@/components/dialog/DialogQuestion";
import RoomTable from "@/components/table/RoomTable";
import { useRoomController } from "@/controller/room-controller";
import React from "react";

export default function RoomPage() {
  const [openSnackbar, snackbarController] = useConsecutiveSnackbars();
  const roomController = useRoomController(openSnackbar)  
  
  return (
    <>
      <PageContainer title="Siensi" description="presensi">
        <RoomTable
          paginationData={roomController.getPaginationData()}
          onAddClicked={roomController.handleOpenDialogAdd}
          onEditClicked={roomController.handleOpenDialogEdit}
          onSearching={(query) => roomController.setPaginationSearch(query)}
          onPageChanged={(page) => roomController.setPaginationPage(page)}
          onDeleteClicked={(guest) => roomController.removeGuest(guest)}
          onRowsPerPageChange={(limit) =>
            roomController.setPaginationLimit(limit)
          }
        />
      </PageContainer>

      <ConsecutiveSnackbars controller={snackbarController} />

      <DialogDelete
        title="Hapus ruangan"
        message="Anda yakin ingin menghapus ruangan ini?"
        open={roomController.openDeleteDialog}
        onClose={roomController.closeDeleteDialog}
        onAccept={roomController.acceptDeleteDialog}
      />

      <DialogCustomizeRoom
        open={roomController.openPaginationDialog}
        mode={roomController.paginationDialogMode}
        room={roomController.editingRoom}
        onSave={(room) => {
          console.log("dialog room")
          console.log(room)
          if (roomController.paginationDialogMode == "add") {
            roomController.saveRoom(room);
          } else {
            roomController.editRoom(room, room.id);
          }
        }}
        onClose={roomController.handleCloseDialog}
      />
    </>
  );
}
