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
          <Grid container>
            <Grid
              border={1}
              borderColor={"lightgray"}
              md={8}
              padding={2}
              borderRadius={3}
            >
              {topRooms ? <TopRoom data={topRooms} /> : <TableSkeleton />}
            </Grid>
            <Grid md={4} border={1} borderRadius={3} borderColor={"lightgray"}>
              {topRoomAttendances ? (
                <TopRoomAttendance data={topRoomAttendances} />
              ) : (
                <TableSkeleton />
              )}
            </Grid>
          </Grid>
        </Box>
      </PageContainer>
    </>
  );
};

export default Dashboard;
