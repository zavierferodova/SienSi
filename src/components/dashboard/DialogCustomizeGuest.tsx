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

const DialogCustomizeGuest = ({
  open,
  onClose,
  onSave,
  mode,
  guest,
}: DialogCustomizeGuestProps) => {
  const [presenceKey, setPresenceKey] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [presenceKeyError, setPresenceKeyError] = useState(false);
  const [presenceKeyErrorMessage, setPresenceKeyErrorMessage] = useState("");
  const [nameError, setNameError] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState("");
  const [genderError, setGenderError] = useState(false);
  const [genderErrorMessage, setGenderErrorMessage] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");

  if (guest == null && mode == "edit") {
    throw new Error("Guest is required when mode is edit");
  }

  const textFieldLimitChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    limit: number,
    dispatcher: React.Dispatch<React.SetStateAction<string>>,
    allowedCharacters?: string
  ) => {
    if (allowedCharacters) {
      const regex = new RegExp(`^[${allowedCharacters}]+$`);
      if (!regex.test(e.target.value)) {
        e.target.value = e.target.value.slice(0, e.target.value.length - 1);
      }
    }

    if (e.target.value.length > limit) {
      e.target.value = e.target.value.slice(0, limit);
    }

    dispatcher(e.target.value);
  };

  const getGuestData = () => {
    return {
      id: guest?.id ?? "",
      key: presenceKey,
      name,
      gender,
      address,
      email,
      phone,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as GuestModel;
  };

  const resetForm = () => {
    setPresenceKey("");
    setName("");
    setGender("");
    setAddress("");
    setEmail("");
    setPhone("");

    setPresenceKeyError(false);
    setPresenceKeyErrorMessage("");
    setNameError(false);
    setNameErrorMessage("");
    setGenderError(false);
    setGenderErrorMessage("");
    setEmailError(false);
    setEmailErrorMessage("");
  };

  const validateForm = () => {
    let isValid = true;

    if (presenceKey.length == 0) {
      setPresenceKeyError(true);
      setPresenceKeyErrorMessage("Kunci presensi harus diisi");
      isValid = false;
    } else {
      setPresenceKeyError(false);
      setPresenceKeyErrorMessage("");
    }

    if (name.length == 0) {
      setNameError(true);
      setNameErrorMessage("Nama harus diisi");
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage("");
    }

    if (gender.length == 0) {
      setGenderError(true);
      setGenderErrorMessage("Kelamin harus diisi");
      isValid = false;
    }

    if (
      email.length > 0 &&
      email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/) == null
    ) {
      setEmailError(true);
      setEmailErrorMessage("Email tidak valid");
      isValid = false;
    }

    return isValid;
  };

  const handleSave = () => {
    if (validateForm()) {
      if (onSave != null) {
        onSave(getGuestData());
      }
    }
  };

  const handleClose = () => {
    if (onClose != null) {
      onClose();
    }
  };

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open])

  useEffect(() => {
    if (mode === "edit" && guest != null) {
      setPresenceKey(guest.key)
      setName(guest.name)
      setGender(guest.gender)
      setAddress(guest.address)
      setEmail(guest.email)
      setPhone(guest.phone)
    }

  }, [guest, mode])

  return (
    <>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
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
            <Button autoFocus color="inherit" onClick={handleSave}>
              {mode == "add" ? "Simpan" : "Ubah"}
            </Button>
          </Toolbar>
        </AppBar>
        <Container sx={{ padding: 2, overflowY: "auto" }}>
          <Stack spacing={2}>
            <Stack spacing={1}>
              <Typography variant="subtitle2" fontWeight={600}>
                Key
              </Typography>
              <CustomTextField
                value={presenceKey}
                error={presenceKeyError}
                helperText={presenceKeyErrorMessage}
                onChange={(e) => textFieldLimitChange(e, 30, setPresenceKey)}
                placeholder="Kunci presensi"
              />
            </Stack>
            <Stack spacing={1}>
              <Typography variant="subtitle2" fontWeight={600}>
                Name
              </Typography>
              <CustomTextField
                value={name}
                error={nameError}
                helperText={nameErrorMessage}
                onChange={(e) => textFieldLimitChange(e, 80, setName)}
                placeholder="Contoh: Abdullah"
              />
            </Stack>
            <Stack spacing={1}>
              <Typography variant="subtitle2" fontWeight={600}>
                Kelamin
              </Typography>
              <FormControl error={genderError}>
                <Select
                  displayEmpty
                  error={genderError}
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <MenuItem value="" disabled>
                    Pilih salah satu
                  </MenuItem>
                  <MenuItem value="male">Laki - Laki</MenuItem>
                  <MenuItem value="female">Perempuan</MenuItem>
                </Select>
                <FormHelperText>{genderErrorMessage}</FormHelperText>
              </FormControl>
            </Stack>
            <Stack spacing={1}>
              <Typography variant="subtitle2" fontWeight={600}>
                Alamat
              </Typography>
              <CustomTextField
                value={address}
                onChange={(e) => textFieldLimitChange(e, 255, setAddress)}
                rows={4}
                multiline
                placeholder="Kec. Provinsi, Kota"
              />
            </Stack>
            <Stack spacing={1}>
              <Typography variant="subtitle2" fontWeight={600}>
                Email
              </Typography>
              <CustomTextField
                inputMode="email"
                value={email}
                error={emailError}
                helperText={emailErrorMessage}
                onChange={(e) => textFieldLimitChange(e, 255, setEmail)}
                placeholder="example@mail.com"
              />
            </Stack>
            <Stack spacing={1}>
              <Typography variant="subtitle2" fontWeight={600}>
                Phone
              </Typography>
              <CustomTextField
                value={phone}
                inputMode="tel"
                onChange={(e) => textFieldLimitChange(e, 20, setPhone, "+0-9")}
                placeholder="+628123456789"
              />
            </Stack>
          </Stack>
        </Container>
      </Dialog>
    </>
  );
};

export default DialogCustomizeGuest;
