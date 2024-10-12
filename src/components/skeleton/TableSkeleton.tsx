import { Skeleton } from "@mui/material";
import React from "react";

export default function TableSkeleton() {
  return (
    <Skeleton
      variant="rounded"
      sx={{ height: "100%", maxHeight: "500px", maxWidth: "900px" }}
    >
      {" "}
      {Array.from({ length: 9 }, (_, index) => (
        <Skeleton
          key={index}
          variant="text"
          sx={{ fontSize: "1rem" }}
        ></Skeleton>
      ))}
    </Skeleton>
  );
}
