import { InsightsModel } from "@/model/dashboard";
import { Card, CardContent } from "@mui/material";
import { BarChart, Star, Person } from "@mui/icons-material";

const Insight = ({ data }: { data: InsightsModel }) => {
  const insightsData = [
    {
      label: "Ruangan",
      value: data.totalRooms.toString(),
      icon: Star,
      color: "#0080ff21",
    },
    {
      label: "Tamu",
      value: data.totalGuests.toString(),
      icon: Person,
      color: "#0080ff21",
    },
    {
      label: "Kehadiran %",
      value: `${data.percentageAttendances.toFixed(1)}%`,
      icon: BarChart,
      color: "#0080ff21",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {insightsData.map((item, index) => (
        <Card
          key={index}
          className={` border-none shadow-sm`}
          sx={{ backgroundColor: item.color }}
        >
          <CardContent className="flex flex-col items-center justify-center p-6">
            <item.icon className={`w-8 h-8 mb-2 text-blue-500 ${item.label}`} />
            <h3 className="text-sm font-medium text-blue-500 mb-1">
              {item.label}
            </h3>
            <p className={`text-2xl font-bold text-blue-500  ${item.label}`}>
              {item.value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Insight;
