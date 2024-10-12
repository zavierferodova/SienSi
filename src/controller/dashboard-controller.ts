import {
  getInsight,
  getTopRooms,
  getTopRoomAttendances,
} from "@/data/dashboard-provider";
import {
  InsightsModel,
  TopRoomsModel,
  TopRoomAttendancesModel,
} from "@/model/dashboard";
import { useEffect, useState } from "react";

export function useDashboardController() {
  const [insight, setInsight] = useState<InsightsModel | null>(null);
  const [topRooms, setTopRooms] = useState<TopRoomsModel | null>(null);
  const [topRoomAttendances, setTopRoomAttendances] =
    useState<TopRoomAttendancesModel | null>(null);

  const fetchInsight = async () => {
    const response = await getInsight();
    setInsight(response);
  };

  const fetchTopRooms = async () => {
    const response = await getTopRooms();
    setTopRooms(response);
  };

  const fetchTopRoomAttendances = async () => {
    const response = await getTopRoomAttendances();
    setTopRoomAttendances(response);
  };

  useEffect(() => {
    fetchInsight();
    fetchTopRooms();
    fetchTopRoomAttendances();
  }, []);

  return {
    insight,
    topRooms,
    topRoomAttendances,
  };
}
