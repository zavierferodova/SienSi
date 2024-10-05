import React from "react";
import {
  AppBar,
  Toolbar,
  styled,
  Stack,
  IconButton,
  Breadcrumbs,
} from "@mui/material";
import PropTypes from "prop-types";
// components
import { IconMenu } from "@tabler/icons-react";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getSession } from "@/data/session-provider";
import { useRoomStore, useSessionStore } from "@/store";
import { getRoom } from "@/data/room-provider";

interface ItemType {
  toggleMobileSidebar: (event: React.MouseEvent<HTMLElement>) => void;
}

const Header = ({ toggleMobileSidebar }: ItemType) => {
  // const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  // const lgDown = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  const router = useRouter();
  const params = useParams<{ id: string; sessionId: string }>();

  const roomStore = useRoomStore();
  const sessionStore = useSessionStore();
  const getRoomName = () => {
    if (roomStore.room) {
      return roomStore.room.name;
    } else {
      getRoom(params.id).then((data) => {
        data && roomStore.setRoom(data.room);
        return data?.room.name;
      });
    }
  };
  const getSessionName = () => {
    if (sessionStore.session) {
      return sessionStore.session.name;
    } else {
      getSession(params.id, params.sessionId).then((data) => {
        data && sessionStore.setSession(data.session);
        return data?.session.name;
      });
    }
  };

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
          <Stack
            sx={{
              display: { xs: "none", lg: "flex" },
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {" "}
            <IconButton onClick={() => router.back()}>
              <ArrowBack />
            </IconButton>
            <Breadcrumbs aria-label="breadcrumb" sx={{ marginLeft: 2 }}>
              <Link href="/">Dashboard</Link>
              <Link href="/room">Ruangan</Link>
              <Link href={`/room/${params.id}`}>{getRoomName()}</Link>
              {params.sessionId && (
                <Link href={`/room/${params.id}/${params.sessionId}`}>
                  {getSessionName()}
                </Link>
              )}
            </Breadcrumbs>
          </Stack>
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
      </ToolbarStyled>
    </AppBarStyled>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
};

export default Header;
