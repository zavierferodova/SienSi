import React from "react";
import {
  Box,
  AppBar,
  Toolbar,
  styled,
  Stack,
  IconButton,
  Button,
  Breadcrumbs,
} from "@mui/material";
import PropTypes from "prop-types";
// components
import Profile from "./Profile";
import { IconMenu } from "@tabler/icons-react";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useParams } from "next/navigation";

interface ItemType {
  toggleMobileSidebar: (event: React.MouseEvent<HTMLElement>) => void;
}

const Header = ({ toggleMobileSidebar }: ItemType) => {
  // const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  // const lgDown = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  const router = useRouter();
  const params = useParams<{ id: string; sessionId: string }>();

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: "none",
    background: theme.palette.background.paper,
    justifyContent: "center",
    backdropFilter: "blur(4px)",
    [theme.breakpoints.up("lg")]: {
      minHeight: "70px",
    },
  }));
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: "100%",
    color: theme.palette.text.secondary,
  }));

  return (
    <AppBarStyled
      position="sticky"
      color="default"
      sx={{ borderBottom: "1px solid #e0e0e0", boxShadow: "none" }}
    >
      <ToolbarStyled>
        {(params.id || params.sessionId) && (
          <>
            {" "}
            <IconButton onClick={() => router.back()}>
              <ArrowBack />
            </IconButton>
            <Breadcrumbs aria-label="breadcrumb" sx={{ marginLeft: 2 }}>
              <Link href="/">Dashboard</Link>
              <Link href="/room">Ruangan</Link>
              <Link href={`/room/${params.id}`}>{params.id}</Link>
              {params.sessionId && (
                <Link href={`/room/${params.id}/${params.sessionId}`}>
                  {params.sessionId}
                </Link>
              )}
            </Breadcrumbs>
          </>
        )}

        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={toggleMobileSidebar}
          sx={{
            display: {
              lg: "none",
              xs: "inline",
            },
          }}
        >
          <IconMenu width="20" height="20" />
        </IconButton>

        <Box flexGrow={1} />
        <Stack spacing={1} direction="row" alignItems="center">
          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
};

export default Header;
