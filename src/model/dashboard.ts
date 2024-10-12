type InsightsModel = {
  totalRooms: number;
  totalGuests: number;
  percentageAttendances: number;
};

type TopRoomsModel = {
  id: string;
  name: string;
  totalGuests: number;
}[];

type TopRoomAttendancesModel = {
  id: string;
  name: string;
  percentageAttendance: number;
}[];

export type { InsightsModel, TopRoomsModel, TopRoomAttendancesModel };
