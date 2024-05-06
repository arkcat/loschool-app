import * as React from "react";

import PartyIcon from "@mui/icons-material/AppRegistrationOutlined";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonthOutlined";
import CheckBoxIcon from "@mui/icons-material/CheckBoxOutlined";
import MainIcon from "@mui/icons-material/HomeOutlined";
import MailIcon from "@mui/icons-material/MailLockOutlined";
import ManageMemberIcon from "@mui/icons-material/ManageAccountsOutlined";
import ManageCharacterIcon from "@mui/icons-material/ManageAccountsSharp";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";

import { Member, fetchSessionId, logout } from "@/api/supabase";
import useMember from "@/hooks/useMember";
import { getBase64Text } from "@/utils/TextUtils";
import { Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Anchor = "left";

export default function SwipeableTemporaryDrawer() {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const router = useRouter();
  const { user, setUser, handleUpdateMember } = useMember();

  useEffect(() => {
    const checkSession = async () => {
      const userId = await fetchSessionId();
      if (userId) {
        handleUpdateMember(userId);
      } else {
        setUser({} as Member);
      }
    };
    checkSession();
  }, []);

  function routeMemberDetails(): void {
    router.push(`/members/details?id=${getBase64Text(user.uid)}`);
  }

  async function handleLogout() {
    await logout();
    setUser({} as Member);
    router.push("/");
  }

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  const showLoginBox = () => {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={1}
      >
        <Typography variant="h6">환영합니다,</Typography>
        <Typography variant="h5">{user.nick_name} 님!</Typography>
        <Box>
          <Button
            variant="contained"
            disableFocusRipple
            onClick={routeMemberDetails}
            style={{ marginRight: "4px" }}
          >
            내 정보
          </Button>
          <Button variant="contained" onClick={handleLogout} disableFocusRipple>
            탈출의 노래
          </Button>
        </Box>
      </Box>
    );
  };

  const showMenuList = () => {
    return (
      <List>
        <ListItem key={"weekly"} disablePadding>
          <ListItemButton
            onClick={() => {
              router.push(`/calendar?id=${getBase64Text(user.uid)}`);
            }}
          >
            <ListItemIcon>
              <CalendarMonthIcon />
            </ListItemIcon>
            <ListItemText primary={"이번주 시간표"} />
          </ListItemButton>
        </ListItem>
        <ListItem key={"schedule"} disablePadding>
          <ListItemButton
            onClick={() => {
              router.push(`/members/schedule?id=${getBase64Text(user.uid)}`);
            }}
          >
            <ListItemIcon>
              <CheckBoxIcon />
            </ListItemIcon>
            <ListItemText primary={"스케쥴 관리"} />
          </ListItemButton>
        </ListItem>
        <ListItem key={"attend"} disablePadding>
          <ListItemButton
            onClick={() => {
              router.push(`/members/attend?id=${getBase64Text(user.uid)}`);
            }}
          >
            <ListItemIcon>
              <CheckBoxIcon />
            </ListItemIcon>
            <ListItemText primary={"출석부"} />
          </ListItemButton>
        </ListItem>
        <ListItem key={"manage member"} disablePadding>
          <ListItemButton
            onClick={() => {
              if (user?.permission === "professor") {
                router.push("/manage/member");
              } else {
                router.push("/members/list");
              }
            }}
          >
            <ListItemIcon>
              <ManageMemberIcon />
            </ListItemIcon>
            <ListItemText primary={"길드 멤버"} />
          </ListItemButton>
        </ListItem>
        <ListItem key={"raid info"} disablePadding>
          <ListItemButton
            onClick={() => {
              router.push(`/info/`);
            }}
          >
            <ListItemIcon>
              <CheckBoxIcon />
            </ListItemIcon>
            <ListItemText primary={"레이드 정보"} />
          </ListItemButton>
        </ListItem>
      </List>
    );
  };

  const showManageMenuList = () => {
    return (
      <List>
        <ListItem key={"manage character"} disablePadding>
          <ListItemButton
            onClick={() => {
              router.push(`/manage/character`);
            }}
          >
            <ListItemIcon>
              <ManageCharacterIcon />
            </ListItemIcon>
            <ListItemText primary={"캐릭터 관리"} />
          </ListItemButton>
        </ListItem>
        {/* <ListItem key={'manage raid'} disablePadding>
                    <ListItemButton onClick={() => {
                        router.push(`/manage/raid`)
                    }}>
                        <ListItemIcon>
                            <ManageRaidIcon />
                        </ListItemIcon>
                        <ListItemText primary={'레이드 관리'} />
                    </ListItemButton>
                </ListItem> */}
        <ListItem key={"manage partyt"} disablePadding>
          <ListItemButton
            onClick={() => {
              router.push(`/manage/party`);
            }}
          >
            <ListItemIcon>
              <PartyIcon />
            </ListItemIcon>
            <ListItemText primary={"파티 편성"} />
          </ListItemButton>
        </ListItem>
        <ListItem key={"checking memeber"} disablePadding>
          <ListItemButton
            onClick={() => {
              router.push(`/manage/CheckingMembers`);
            }}
          >
            <ListItemIcon>
              <PartyIcon />
            </ListItemIcon>
            <ListItemText primary={"공대참여현황"} />
          </ListItemButton>
        </ListItem>
      </List>
    );
  };

  const showOtherMenuList = () => {
    return (
      <List>
        <ListItem key={"other mailbox"} disablePadding>
          <ListItemButton
            onClick={() => {
              const newTabUrl =
                "https://docs.google.com/forms/d/e/1FAIpQLSdi6CBNw6rQOB1PB-QeIWi8RwSZITa-XQqfAWUuIbqQZVgDxw/viewform";
              window.open(newTabUrl, "_blank");
            }}
          >
            <ListItemIcon>
              <MailIcon />
            </ListItemIcon>
            <ListItemText primary={"익명 건의함"} />
          </ListItemButton>
        </ListItem>
      </List>
    );
  };

  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: "auto", padding: "20px" }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      {user.uid ? showLoginBox() : <h1>로그인해주세요</h1>}

      <Divider sx={{ padding: "10px" }} />

      <List>
        <ListItem key={"main"} disablePadding>
          <ListItemButton
            onClick={() => {
              router.push("/");
            }}
          >
            <ListItemIcon>
              <MainIcon />
            </ListItemIcon>
            <ListItemText primary={"메인 화면"} />
          </ListItemButton>
        </ListItem>
      </List>
      {(user?.permission === "senior" || user?.permission === "professor") &&
        showMenuList()}
      {user?.permission === "professor" && showManageMenuList()}
      {(user?.permission === "senior" || user?.permission === "professor") &&
        showOtherMenuList()}
    </Box>
  );

  return (
    <div>
      {(["left"] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          <Button
            color="inherit"
            onClick={toggleDrawer(anchor, true)}
            sx={{
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
            style={{ position: "absolute", zIndex: 1 }}
            disableRipple
          >
            <MenuIcon className="header-icon" />
            <Typography variant="h4" className="header-text">
              {user?.nick_name}
            </Typography>
          </Button>

          <SwipeableDrawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
          >
            {list(anchor)}
          </SwipeableDrawer>
        </React.Fragment>
      ))}
    </div>
  );
}
