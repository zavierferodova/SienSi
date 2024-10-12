"use client";
import PageContainer from "@/components/container/PageContainer";
import Insight from "@/components/dashboard/Insight";
import TopRoom from "@/components/dashboard/TopRoom";
import TopRoomAttendance from "@/components/dashboard/TopRoomAttendance";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { useDashboardController } from "@/controller/dashboard-controller";
import { Box, Grid } from "@mui/material";

const Dashboard = () => {
  const { insight, topRooms, topRoomAttendances } = useDashboardController();
  return (
    <>
      <PageContainer title="Dashboard | Siensi" description="presensi">
        <Box>{insight ? <Insight data={insight} /> : <TableSkeleton />}</Box>
        <Box>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="col-span-1 md:col-span-2 border p-2 rounded-lg">
              {topRooms ? <TopRoom data={topRooms} /> : <TableSkeleton />}
            </div>
            <div className="col-span-1 border p-2 rounded-lg w-full">
              {topRoomAttendances ? (
                <TopRoomAttendance data={topRoomAttendances} />
              ) : (
                <TableSkeleton />
              )}
            </div>
          </div>
        </Box>
      </PageContainer>
    </>
  );
};

export default Dashboard;
