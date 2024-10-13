"use client";
import PageContainer from "@/components/container/PageContainer";
import AttendanceTable from "@/components/table/AttendanceTable";
import CameraCard from "@/components/dashboard/CameraCard";
import ConsecutiveSnackbars, { useConsecutiveSnackbars } from "@/components/dashboard/ConsecutiveSnackbars";
import { useAttendanceController } from "@/controller/attendance-controller";
import { PieChart } from "@mui/x-charts";
import DialogDetailAttendance from "@/components/dialog/DialogDetailAttendance";

export default function SessionPage({
  params,
}: {
  params: { id: string; sessionId: string };
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [openSnackbar, snackbarController] = useConsecutiveSnackbars();
  const attendanceController = useAttendanceController(
    openSnackbar,
    params.id,
    params.sessionId
  );

  const valueFormatter = (item: { value: number }) => `${item.value}%`;

  return (
    <>
      <PageContainer title="Siensi" description="presensi">
        <div className="flex flex-col items-center">
          <div className="max-w-[900px] w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center mb-10 w-full">
              <div className="col-span-1 md:col-span-2 w-full">
                <h3 className="text-xl font-semibold mb-2">Grafik Kehadiran</h3>
                <PieChart
                  series={[
                    {
                      data: [
                        {
                          label: "Hadir",
                          value: attendanceController.attendancePercentage,
                        },
                        {
                          label: "Tidak Hadir",
                          value: 100 - attendanceController.attendancePercentage,
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
              <div className="col-span-1">
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
            />
            </div>
          </div>
      </PageContainer>

      <ConsecutiveSnackbars controller={snackbarController} />

      <DialogDetailAttendance
        open={attendanceController.openDetailDialog}
        onClose={attendanceController.closeDetailDialog}
        attendance={attendanceController.detailAttendance}
      />
    </>
  );
}
