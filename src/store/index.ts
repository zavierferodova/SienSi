import RoomModel from "@/model/room";
import SessionModel from "@/model/session";
import { create } from "zustand";

interface RoomState {
  room: RoomModel | null;
  setRoom: (room: RoomModel) => void;
  clearRoom: () => void;
}

const useRoomStore = create<RoomState>((set) => ({
  room: null,
  setRoom: (room: RoomModel) => set({ room }),
  clearRoom: () => set({ room: null }),
}));

interface SessionState {
  session: SessionModel | null;
  setSession: (session: SessionModel) => void;
  clearSession: () => void;
}

const useSessionStore = create<SessionState>((set) => ({
  session: null,
  setSession: (session: SessionModel) => set({ session }),
  clearSession: () => set({ session: null }),
}));

export { useSessionStore, useRoomStore };
