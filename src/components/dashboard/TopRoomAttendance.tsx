import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from "@mui/material/styles";
import { TopRoomAttendancesModel } from "@/model/dashboard";

const TopRoomAttendance = ({ data }: { data: TopRoomAttendancesModel }) => {
  const names = data.map((item) => item.name);
  const totalPercentages = data.map((item) => item.percentageAttendance);

  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = "#ecf2ff";

  // chart
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const optionscolumnchart: any = {
    chart: {
      type: "donut",
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: {
        show: false,
      },
      height: 155,
    },
    colors: [primary, primarylight, "#F9F9FD"],
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: "75%",
          background: "transparent",
        },
      },
    },
    labels: names,
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      fillSeriesColor: false,
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    responsive: [
      {
        breakpoint: 991,
        options: {
          chart: {
          },
        },
      },
    ],
  };
  const seriescolumnchart = totalPercentages;

  return (
    <Chart
      options={optionscolumnchart}
      series={seriescolumnchart}
      type="donut"
      height={300}
      width={"100%"}
    />
  );
};

export default TopRoomAttendance;
