import GuestModel from "./guest"

type AttendanceModel = {
    id: string,
    time: string,
    guest: GuestModel
}

export default AttendanceModel;
