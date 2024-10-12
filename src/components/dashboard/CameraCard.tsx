/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/exhaustive-deps */
import { useTheme } from "@mui/material";
import { Card } from "@mui/material";
import { IconCamera } from "@tabler/icons-react";
import QrScanner from "qr-scanner";
import { useEffect, useRef, useState } from "react";
import { ConsecutiveSnackbarsDispatcher } from "./ConsecutiveSnackbars";

type CameraCardProps = {
  onQRScanned?: (data: string) => void;
  snackbarDispatcher: ConsecutiveSnackbarsDispatcher;
};

const CameraCard = ({ onQRScanned, snackbarDispatcher }: CameraCardProps) => {
  const theme = useTheme();
  const videoEl = useRef<HTMLVideoElement>(null);
  const qrBoxEl = useRef<HTMLDivElement>(null);
  const scanner = useRef<QrScanner>();
  const [cameraOpen, setCameraOpen] = useState(false);
  const mainColor = theme.palette.primary.main;

  const openCloseCamera = async () => {
    if (cameraOpen) {
      scanner.current?.stop();
    } else {
      scanner.current?.start().catch((err) => {
        if (err) setCameraOpen(false);
      });
    }

    setCameraOpen(!cameraOpen);
  };

  const onScanSuccess = (result: QrScanner.ScanResult) => {
    if (onQRScanned) {
      onQRScanned(result.data);
      snackbarDispatcher("Berhasil menambahkan tamu!", "success");
    }
  };

  useEffect(() => {
    if (videoEl?.current && !scanner.current) {
      scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
        maxScansPerSecond: 2,
        preferredCamera: "environment",
        highlightScanRegion: true,
        highlightCodeOutline: true,
        overlay: qrBoxEl?.current || undefined,
      });

      scanner?.current
        ?.start()
        .then(() => setCameraOpen(true))
        .catch((err) => {
          if (err) setCameraOpen(false);
        });
    }

    return () => {
      if (!videoEl?.current) {
        scanner?.current?.stop();
        scanner.current = undefined;
      }
    };
  }, [cameraOpen]);
  return (
    <Card
      sx={{
        width: "100%",
        height: "100%",
        minHeight: "320px",
        maxHeight: "320px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: mainColor,
        cursor: "pointer",
      }}
      onClick={openCloseCamera}
    >
      {cameraOpen ? (
        <div className="w-full h-full">
          <video ref={videoEl}></video>
          <div
            ref={qrBoxEl}
            className={`
             
             border-2 border-green-500 w-full`}
          ></div>
        </div>
      ) : (
        <IconCamera style={{ color: "white" }} size={56} />
      )}
    </Card>
  );
};

export default CameraCard;
