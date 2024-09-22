import { Typography } from "@mui/material";

const Loading = () => {
  return (
    <div className="w-full h-dvh flex justify-center items-center flex-col space-y-4">
      <div className="loader"></div>
      <Typography variant="h4" color="text.secondary">
        Memuat...
      </Typography>
    </div>
  );
};

export default Loading;
