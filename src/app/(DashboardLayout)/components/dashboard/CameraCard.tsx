/* eslint-disable react-hooks/exhaustive-deps */
import { useTheme } from "@mui/material";
import { Card } from "@mui/material";
import { IconCamera } from "@tabler/icons-react";
import QrScanner from "qr-scanner";
import { useEffect, useState } from "react";
import Webcam from "react-webcam";

type CameraCardProps = {
  onQRScanned?: (data: string) => void;
};

const CameraCard = ({ onQRScanned }: CameraCardProps) => {
  const theme = useTheme();
  const [cameraId, setCameraId] = useState<string | undefined>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [webcam, setWebcam] = useState<any | null>(null);
  const [scanner, setScanner] = useState<QrScanner | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const mainColor = theme.palette.primary.main;

  const setMainCamera = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameraDevices = devices.find(
      (device) => device.kind === "videoinput"
    );

    if (cameraDevices) {
      setCameraId(cameraDevices.deviceId);
    }
  };

  const stopScanner = () => {
    if (scanner) {
      scanner.destroy();
      setScanner(null);
    }
  };

  const turnOffWebcam = () => {
    if (webcam) {
      webcam?.video?.srcObject
        ?.getTracks()
        .forEach((track: MediaStreamTrack) => {
          track.stop();
        });
    }
  };

  const openCloseCamera = async () => {
    if (cameraOpen) {
      turnOffWebcam();
      stopScanner();
    }

    setCameraOpen(!cameraOpen);
  };

  const initQRScanner = () => {
    if (webcam) {
      if (webcam.video) {
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
    }
  };

  const initCamera = async () => {
    await setMainCamera();
  };

  useEffect(() => {
    if (cameraOpen) {
      initCamera();
      initQRScanner();
    }
  }, [cameraOpen, onQRScanned, webcam, cameraId]);

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
          ref={(ref) => {
            setWebcam(ref);
          }}
          videoConstraints={{
            deviceId: cameraId,
          }}
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
