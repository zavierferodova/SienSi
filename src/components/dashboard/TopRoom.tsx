import React from "react";
import { useTheme } from "@mui/material/styles";
import dynamic from "next/dynamic";
import { TopRoomsModel } from "@/model/dashboard";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const TopRoom = ({ data }: { data: TopRoomsModel }) => {
  const names = data.map((item) => item.name);
  const totalGuests = data.map((item) => item.totalGuests);
  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  // chart
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const optionscolumnchart: any = {
    chart: {
      type: "bar",
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: {
        show: true,
      },
      height: 370,
    },
    colors: [primary, secondary],
    plotOptions: {
      bar: {
        horizontal: false,
        barHeight: "60%",
        columnWidth: "42%",
        borderRadius: [6],
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "all",
      },
    },

    stroke: {
      show: true,
      width: 5,
      lineCap: "butt",
      colors: ["transparent"],
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    grid: {
      borderColor: "rgba(0,0,0,0.1)",
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    yaxis: {
      tickAmount: 4,
    },
    xaxis: {
      categories: names,
      axisBorder: {
        show: false,
      },
    },
    tooltip: {
      theme: "dark",
      fillSeriesColor: false,
    },
  };
  const seriescolumnchart = [
    {
      name: "Jumlah tamu",
      data: totalGuests,
    },
  ];

  return (
    <Chart
      options={optionscolumnchart}
      series={seriescolumnchart}
      type="bar"
      height={265}
      width={"100%"}
    />
  );
};

export default TopRoom;
