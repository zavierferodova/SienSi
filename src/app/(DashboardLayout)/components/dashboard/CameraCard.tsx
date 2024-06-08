import { useTheme } from "@mui/material";
import { Card } from "@mui/material";
import { IconCamera } from "@tabler/icons-react";
import QrScanner from "qr-scanner";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

type CameraCardProps = {
  onQRScanned?: (data: string) => void;
};

const CameraCard = ({ onQRScanned }: CameraCardProps) => {
  const theme = useTheme();
  const [cameraOpen, setCameraOpen] = useState(false);
  const mainColor = theme.palette.primary.main;
  const webcamRef = useRef(null);

  const turnOffWebcam = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const webcam: any = webcamRef.current;
    if (webcam) {
      webcam.video.srcObject.getTracks().forEach((track: MediaStreamTrack) => {
        track.stop();
      });
    }
  };

  const openCloseCamera = () => {
    if (cameraOpen) {
      turnOffWebcam();
    }

    setCameraOpen(!cameraOpen);
  };

  const initQRScanner = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const webcam: any = webcamRef.current;
    if (webcam) {
      const qrScanner = new QrScanner(
        webcam.video,
        (result: QrScanner.ScanResult) => {
          if (onQRScanned) {
            onQRScanned(result.data);
          }
        },
        { maxScansPerSecond: 2 }
      );

      qrScanner.start();
    }
  };

  useEffect(initQRScanner, [cameraOpen, onQRScanned]);

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
        <Webcam
          ref={webcamRef}
          style={{
            width: "100%",
            height: "100%",
            background: "black",
            objectFit: "cover",
          }}
          audio={false}
          screenshotFormat="image/jpeg"
          mirrored={true}
        />
      ) : (
        <IconCamera style={{ color: "white" }} size={56} />
      )}
    </Card>
  );
};

export default CameraCard;
