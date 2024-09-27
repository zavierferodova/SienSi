import GuestModel from "./guest";

type AttendanceModel = {
  id: string;
  sessionId: string;
  guestId: string;
  time: string;
  createdAt: string;
  updatedAt: string;
  guest: GuestModel;
};

export default AttendanceModel;
