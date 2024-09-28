import {
  AppBar,
  Button,
  Container,
  Dialog,
  FormControl,
  FormHelperText,
  IconButton,
  MenuItem,
  Select,
  Slide,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import SessionModel from "@/model/session";
import CustomTextField from "../forms/theme-elements/CustomTextField";
import { z } from "zod";
import { baselightTheme } from "@/utils/theme/DefaultColors";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type DialogCustomizeSessionProps = {
  open: boolean;
  mode: "add" | "edit";
  session?: SessionModel | null;
  roomId: string;
  onClose?: () => void;
  onSave?: (session: SessionModel) => void;
};

const sessionFormSchema = z.object({
  name: z.string().min(3, {
    message: "Nama minimal 3 karakter",
  }),
  allowPresence: z.boolean(),
});
const DialogCustomizeSession = ({
  open,
  onClose,
  onSave,
  mode,
  session,
  roomId,
}: DialogCustomizeSessionProps) => {
  const [defaultValues, setDefaultValues] = useState({
    name: "",
    allowPresence: true,
  });
  const [formError, setFormError] = useState({
    name: "",
    allowPresence: true,
  });

  if (session == null && mode == "edit") {
    throw new Error("Session is required when mode is edit");
  }

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name")?.toString() || "",
      allowPresence: formData.get("allowPresence") === "true",
    };
    try {
      if (onSave != null) {
        sessionFormSchema.parse(data);

        onSave({
          ...data,
          roomId,
          id: session?.id ?? "",
          createdAt: session?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as SessionModel);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {
          name: "",
          allowPresence: true,
        };

        error.errors.forEach((err) => {
          const field = err.path[0] as keyof typeof formError;
          // @ts-expect-error disable types
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
        allowPresence: true,
      });
      onClose();
    }
  };

  useEffect(() => {
    if (mode === "edit" && session != null) {
      setDefaultValues({
        name: session.name,
        allowPresence: session.allowPresence,
      });
    } else {
      setDefaultValues({
        name: "",
        allowPresence: true,
      });
    }
  }, [session, mode]);
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
                Tamu
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
                  placeholder="Sesi 1"
                />
              </Stack>
              <Stack spacing={1}>
                <Typography variant="subtitle2" fontWeight={600}>
                  Allow Presence
                </Typography>
                <FormControl>
                  <Select
                    displayEmpty
                    name="allowPresence"
                    defaultValue={defaultValues.allowPresence}
                  >
                    <MenuItem value="" disabled>
                      Pilih salah satu
                    </MenuItem>
                    <MenuItem value="true">True</MenuItem>
                    <MenuItem value="false">False</MenuItem>
                  </Select>
                  <FormHelperText
                    sx={{ color: baselightTheme.palette.error.main }}
                  >
                    {formError.allowPresence}
                  </FormHelperText>
                </FormControl>
              </Stack>
            </Stack>
          </Container>
        </form>
      </Dialog>
    </>
  );
};

export default DialogCustomizeSession;
