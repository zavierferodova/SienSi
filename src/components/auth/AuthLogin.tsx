import React from "react";
import { Box, Typography, Button, Stack } from "@mui/material";

import CustomTextField from "@/components/forms/theme-elements/CustomTextField";

interface loginType {
  authLoading?: boolean;
  authError?: boolean;
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
  onSubmit?: (email: string, password: string) => void;
}

const AuthLogin = ({
  authLoading,
  authError,
  title,
  subtitle,
  subtext,
  onSubmit,
}: loginType) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}

      <Box
        component="form"
        onSubmit={(event) => {
          event.preventDefault();
          if (onSubmit) {
            onSubmit(email, password);
          }
        }}
      >
        <Stack mb="10px">
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="email"
              mb="5px"
            >
              Email
            </Typography>
            <CustomTextField
              required
              variant="outlined"
              fullWidth
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </Box>
          <Box mt="25px" mb="25px">
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="password"
              mb="5px"
            >
              Password
            </Typography>
            <CustomTextField
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              variant="outlined"
              fullWidth
            />
          </Box>
          {authError ? (
            <Typography color="error">
              Login gagal, cek kembali email atau password anda !
            </Typography>
          ) : null}
        </Stack>
        <Box>
          <Button
            disabled={authLoading}
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            type="submit"
          >
            {authLoading ? "Loading..." : "Login"}
          </Button>
        </Box>
        {subtitle}
      </Box>
    </>
  );
};

export default AuthLogin;
