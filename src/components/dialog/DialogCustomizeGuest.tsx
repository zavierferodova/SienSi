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
import GuestModel from "@/model/guest";
import CustomTextField from "../forms/theme-elements/CustomTextField";
import { z } from "zod";
import { baselightTheme } from "@/utils/theme/DefaultColors";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("1234567890abcdef", 10);
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
  guest?: GuestModel | null;
  onClose?: () => void;
  onSave?: (guest: GuestModel) => void;
};

const guestFormSchema = z.object({
  key: z
    .string()
    .min(3, {
      message: "Kunci presensi minimal 3 karakter",
    })
    .max(30, { message: "Kunci presensi maksimal 30 karakter" }),
  name: z.string().min(3, {
    message: "Nama minimal 3 karakter",
  }),
  email: z.string().email({ message: "Email tidak valid" }),
  gender: z.enum(["male", "female"], {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    errorMap: (issue, ctx) => ({ message: "Pilih salah satu jenis kelamin" }),
  }),
  address: z
    .string()
    .min(3, { message: "Alamat tidak valid" })
    .max(255, { message: "Alamat maksimal 255 karakter" })
    .optional(),
  phone: z
    .string()
    .min(10, { message: "Nomor telepon tidak valid" })
    .max(13, { message: "Nomor telepon tidak valid" })
    .optional(),
});
const DialogCustomizeGuest = ({
  open,
  onClose,
  onSave,
  mode,
  guest,
}: DialogCustomizeGuestProps) => {
  const [defaultValues, setDefaultValues] = useState({
    key: "",
    name: "",
    email: "",
    gender: "",
    address: "",
    phone: "",
  });
  const [formError, setFormError] = useState({
    key: "",
    name: "",
    email: "",
    gender: "",
    address: "",
    phone: "",
  });

  if (guest == null && mode == "edit") {
    throw new Error("Guest is required when mode is edit");
  }

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = {
      key: formData.get("key")?.toString() || "",
      name: formData.get("name")?.toString() || "",
      gender: formData.get("gender")?.toString() || "",
      email: formData.get("email")?.toString() || "",
    };
    try {
      if (onSave != null) {
        guestFormSchema.parse({
          ...data,
          ...(formData.get("address")
            ? { address: formData.get("address")?.toString() }
            : {}),
          ...(formData.get("phone")
            ? { phone: formData.get("phone")?.toString() }
            : {}),
        });

        onSave({
          ...data,
          address: formData.get("address")?.toString() ?? "",
          email: formData.get("email")?.toString() ?? "",
          id: guest?.id ?? "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          roomId: guest?.roomId ?? "",
          photo: guest?.photo ?? "",
          ...(formData.get("phone") !== ""
            ? { phone: formData.get("phone")?.toString() }
            : {}),
        } as GuestModel);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {
          key: "",
          name: "",
          email: "",
          gender: "",
          address: "",
          phone: "",
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
        key: "",
        name: "",
        email: "",
        gender: "",
        address: "",
        phone: "",
      });
      onClose();
    }
  };

  const generateKey = () => {
    const key = nanoid();
    setDefaultValues({ ...defaultValues, key });
  };

  useEffect(() => {
    if (mode === "edit" && guest != null) {
      setDefaultValues({
        key: guest.key,
        name: guest.name,
        email: guest.email,
        gender: guest.gender,
        address: guest.address,
        phone: guest.phone,
      });
    } else {
      setDefaultValues({
        key: "",
        name: "",
        email: "",
        gender: "",
        address: "",
        phone: "",
      });
    }
  }, [guest, mode]);
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
              <Stack spacing={1} position="relative">
                <Typography variant="subtitle2" fontWeight={600}>
                  Key
                </Typography>
                <CustomTextField
                  helperText={formError.key}
                  value={defaultValues.key}
                  onChange={(e) =>
                    setDefaultValues({
                      ...defaultValues,
                      key: e.target.value,
                    })
                  }
                  name="key"
                  placeholder="Kunci presensi"
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={generateKey}
                  sx={{
                    position: "absolute",
                    right: 10,
                    bottom: 10,
                    width: "fit-content",
                  }}
                >
                  Generate
                </Button>
              </Stack>
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
                  Email
                </Typography>
                <CustomTextField
                  inputMode="email"
                  defaultValue={defaultValues.email}
                  name="email"
                  helperText={formError.email}
                  placeholder="example@mail.com"
                />
              </Stack>
              <Stack spacing={1}>
                <Typography variant="subtitle2" fontWeight={600}>
                  Kelamin
                </Typography>
                <FormControl>
                  <Select
                    displayEmpty
                    name="gender"
                    defaultValue={defaultValues.gender}
                  >
                    <MenuItem value="" disabled>
                      Pilih salah satu
                    </MenuItem>
                    <MenuItem value="male">Laki - Laki</MenuItem>
                    <MenuItem value="female">Perempuan</MenuItem>
                  </Select>
                  <FormHelperText
                    sx={{ color: baselightTheme.palette.error.main }}
                  >
                    {formError.gender}
                  </FormHelperText>
                </FormControl>
              </Stack>
              <Stack spacing={1}>
                <Typography variant="subtitle2" fontWeight={600}>
                  Alamat
                </Typography>
                <CustomTextField
                  defaultValue={defaultValues.address}
                  name="address"
                  helperText={formError.address}
                  rows={4}
                  multiline
                  placeholder="Kec. Provinsi, Kota"
                />
              </Stack>
              <Stack spacing={1}>
                <Typography variant="subtitle2" fontWeight={600}>
                  Phone
                </Typography>
                <CustomTextField
                  defaultValue={defaultValues.phone}
                  inputMode="tel"
                  name="phone"
                  helperText={formError.phone}
                  placeholder="+628123456789"
                />
              </Stack>
            </Stack>
          </Container>
        </form>
      </Dialog>
    </>
  );
};

export default DialogCustomizeGuest;
