"use client";
import GuestTable from "@/components/dashboard/GuestTable";
import { useDashboardController } from "@/controller/dashboard-controller";

export default function SessionPage() {
  const [snackbarController, guestController, attendanceController] =
    useDashboardController();
  return (
    <div>
      <GuestTable
        paginationData={guestController.getPaginationData()}
        onPageChanged={(page) => guestController.setPaginationPage(page)}
        onRowsPerPageChange={(limit) =>
          guestController.setPaginationLimit(limit)
        }
        onSearching={(query) => guestController.setPaginationSearch(query)}
        onAddClicked={guestController.handleOpenDialogAdd}
        onEditClicked={(guest) => guestController.handleOpenDialogEdit(guest)}
        onDeleteClicked={(id) => guestController.removeGuest(id)}
        onQRImageClicked={(id) => guestController.viewGuestQRImage(id)}
      />
    </div>
  );
}
