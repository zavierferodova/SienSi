import { RoomData } from "@/app/(DashboardLayout)/room/[id]/page";
import { getRoom } from "@/data/room-provider";
import { useRoomStore } from "@/store";
import { useState, useEffect } from "react";
import { useGuestController } from "./guest-controller";
import { useSessionController } from "./session-controller";
import { ConsecutiveSnackbarsDispatcher } from "@/components/dashboard/ConsecutiveSnackbars";

const useDetailRoomController = (
  roomId: string,
  snackbarDispatcher: ConsecutiveSnackbarsDispatcher
) => {
  const [roomData, setRoomData] = useState<RoomData | undefined>(undefined);
  const guestController = useGuestController(roomId, snackbarDispatcher);
  const sessionController = useSessionController(roomId, snackbarDispatcher);
  const roomStore = useRoomStore();

  useEffect(() => {
    const getRoomData = async (): Promise<RoomData | undefined> => {
      if (roomStore.room) {
        setRoomData({
          name: roomStore.room.name,
          description: roomStore.room.description,
        });
      } else {
        const data = await getRoom(roomId);
        if (data && data.room) {
          roomStore.setRoom(data.room);
          setRoomData({
            name: data.room.name,
            description: data.room.description,
          });
        }
      }
      return undefined;
    };
    getRoomData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    roomData,
    guestController,
    sessionController,
  }
};

export default useDetailRoomController;
