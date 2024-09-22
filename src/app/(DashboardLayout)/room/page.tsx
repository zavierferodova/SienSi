"use client";
import { Button } from "@mui/material";
import React from "react";
import { useDashboardController } from "../../../controller/dashboard-controller";

export default function RoomPage() {
  const [snackbarController, guestController] = useDashboardController();
  return (
    <div>
      <Button href="/room/1">Ruangan 1</Button>
      <Button onClick={guestController.handleOpenDialogAdd}>add guest</Button>
    </div>
  );
}
