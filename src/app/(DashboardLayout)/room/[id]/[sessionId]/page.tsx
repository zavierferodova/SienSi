"use client";
import PageContainer from "@/components/container/PageContainer";
import AttendanceTable from "@/components/table/AttendanceTable";
import CameraCard from "@/components/dashboard/CameraCard";
import { useConsecutiveSnackbars } from "@/components/dashboard/ConsecutiveSnackbars";
import { useAttendanceController } from "@/controller/attendance-controller";
import { getGuestPagination } from "@/data/guest-provider";
import { PieChart } from "@mui/x-charts";
import { useEffect, useState } from "react";
import DialogDetailAttendance from "@/components/dialog/DialogDetailAttendance";

export const valueFormatter = (item: { value: number }) => `${item.value}%`;

export default function SessionPage({
  params,
}: {
  params: { id: string; sessionId: string };
}) {
  const [openSnackbar, snackbarController] = useConsecutiveSnackbars();
  const [attendancePercent, setAttendancePercent] = useState(0);
  const attendanceController = useAttendanceController(
    openSnackbar,
    params.id,
    params.sessionId
  );
  useEffect(() => {
    const f = async () => {
      const guests = await getGuestPagination(params.id);
      if (attendanceController) {
        const paginationData = attendanceController.getPaginationData();
        if (paginationData && guests) {
          setAttendancePercent((paginationData.total / guests.total) * 100);
        }
      }
    };
    f();
  }, [attendanceController]);
  return (
    <>
      <PageContainer title="Siensi" description="presensi">
        <div className="grid md:grid-cols-2 items-center mb-10">
          <div>
            <h3 className="text-xl font-semibold">Grafik Kehadiran</h3>
            <PieChart
              series={[
                {
                  data: [
                    {
                      label: "Hadir",
                      value: attendancePercent,
                    },
                    {
                      label: "Tidak Hadir",
                      value: 100 - attendancePercent,
                    },
                  ],
                  highlightScope: { fade: "global", highlight: "item" },
                  faded: {
                    innerRadius: 30,
                    additionalRadius: -30,
                    color: "gray",
                  },
                  valueFormatter,
                },
              ]}
              height={200}
            />
          </div>
          <div className="max-w-[85%]">
            <CameraCard
              onQRScanned={(qrCode) => {
                attendanceController.checkAttendance(qrCode);
              }}
              snackbarDispatcher={openSnackbar}
            />
          </div>
        </div>

        <AttendanceTable
          paginationData={attendanceController.getPaginationData()}
          onPageChanged={(page) => attendanceController.setPaginationPage(page)}
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
        />

        <DialogDetailAttendance
          open={attendanceController.openDetailDialog}
          onClose={attendanceController.closeDetailDialog}
          attendance={attendanceController.detailAttendance}
        />
      </PageContainer>
    </>
  );
}
