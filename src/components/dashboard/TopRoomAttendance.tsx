import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from "@mui/material/styles";
import { TopRoomAttendancesModel } from "@/model/dashboard";
import { ApexOptions } from "apexcharts";

const TopRoomAttendance = ({ data }: { data: TopRoomAttendancesModel }) => {
  const names = data.map((item) => item.name);
  const totalSum = data.reduce((sum, item) => sum + item.percentageAttendance, 0);
  const totalPercentages = data.map((item) => (item.percentageAttendance / totalSum) * 100);

  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = "#ecf2ff";

  // chart
  const optionscolumnchart: ApexOptions = {
    title: {
      text: "Top Room by Percentage Attendance",
      align: "center",
      style: {
        fontSize: "16px",
        color: theme.palette.text.primary,
      },
    },
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
  console.log(seriescolumnchart);

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
