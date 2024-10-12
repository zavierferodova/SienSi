import {
  AppBar,
  Button,
  Container,
  Dialog,
  IconButton,
  Slide,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import CustomTextField from "../forms/theme-elements/CustomTextField";
import { z } from "zod";
import RoomModel from "@/model/room";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type DialogCustomizeGuestProps = {
  open: boolean;
  mode: "add" | "edit";
  room?: RoomModel | null;
  onClose?: () => void;
  onSave?: (room: RoomModel) => void;
};

const guestFormSchema = z.object({
  name: z.string().min(3, {
    message: "Nama minimal 3 karakter",
  }),
  description: z.string().min(3, {
    message: "Deskripsi minimal 3 karakter",
  }).max(255, { message: "Deskripsi maksimal 255 karakter" }),
});

const DialogCustomizeRoom = ({
  open,
  onClose,
  onSave,
  mode,
  room,
}: DialogCustomizeGuestProps) => {
  const [defaultValues, setDefaultValues] = useState({
    name: "",
    description: ""
  });

  const [formError, setFormError] = useState({
    name: "",
    description: ""
  });

  if (room == null && mode == "edit") {
    throw new Error("Room is required when mode is edit");
  }

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name")?.toString() || "",
      description: formData.get("description")?.toString() || "",
    };

    try {
      if (onSave != null) {
        guestFormSchema.parse({
          ...data
        });

        onSave({
          id: room?.id || "",
          ...data
        } as RoomModel);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {
          name: "",
          description: "",
        };

        error.errors.forEach((err) => {
          const field = err.path[0] as keyof typeof formError;
          newErrors[field] = err.message;
        });

        setFormError(newErrors);
      }
    }
  };

  const handleClose = () => {
    if (onClose != null) {
      setFormError({
        name: "",
        description: "",
      });
      onClose();
    }
  };

  useEffect(() => {
    if (mode === "edit" && room != null) {
      setDefaultValues({
        name: room.name,
        description: room.description,
      });
    } else {
      setDefaultValues({
        name: "",
        description: "",
      });
    }
  }, [room, mode]);

  return (
    <>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <form onSubmit={handleSave}>
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Ruangan
              </Typography>
              <Button autoFocus color="inherit" type="submit">
                {mode == "add" ? "Tambakan" : "Simpan"}
              </Button>
            </Toolbar>
          </AppBar>
          <Container sx={{ padding: 2, overflowY: "auto" }}>
            <Stack spacing={2}>
              <Stack spacing={1}>
                <Typography variant="subtitle2" fontWeight={600}>
                  Name
                </Typography>
                <CustomTextField
                  defaultValue={defaultValues.name}
                  name="name"
                  helperText={formError.name}
                  placeholder="Budi Rakhmadi"
                />
              </Stack>
              <Stack spacing={1}>
                <Typography variant="subtitle2" fontWeight={600}>
                  Deskripsi
                </Typography>
                <CustomTextField
                  defaultValue={defaultValues.description}
                  name="description"
                  helperText={formError.description}
                  rows={4}
                  multiline
                  placeholder="Tulis deskripsi disini"
                />
              </Stack>
            </Stack>
          </Container>
        </form>
      </Dialog>
    </>
  );
};

export default DialogCustomizeRoom;
