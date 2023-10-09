import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CheckBoxIcon from '@mui/icons-material/CheckBoxOutlined';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonthOutlined'
import userAtom from '@/recoil/userAtom';
import { useRecoilState } from 'recoil';
import { supabase } from '@/utils/supabase';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/navigation';
import { getBase64Text } from '@/utils/TextUtils';
import { useEffect } from 'react';

type Anchor = 'left';

export default function SwipeableTemporaryDrawer() {
    useEffect(() => {
        const fetchUser = async () => {
            try {
                console.log(`fetch user session ${userState}`)
                const authSession = supabase.auth.getSession();
                console.log(authSession)
                const currentSession = (await authSession).data.session
                if (currentSession !== null) {
                    getLoginMember(currentSession.user.id)
                } else {
                    setUserState({ id: '', name: '' });
                }
            } catch (error: any) {
                console.error('사용자 정보 가져오기 오류:', error.message);
            }
        };

        fetchUser();
    }, []);

    const getLoginMember = async (uid: string) => {
        try {
          console.log(`fetch members ${uid}`)
          const { data, error } = await supabase
            .from('Member')
            .select('id, uid, nick_name')
            .eq('uid', uid);
    
          if (error) {
            throw error;
          }

          if (data.length == 1) {
            setUserState({ id: data[0].uid, name: data[0].nick_name })
          }
        } catch (error: any) {
          console.error('Error updating member:', error.message);
        }
      };

    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });
    const router = useRouter();
    const [userState, setUserState] = useRecoilState(userAtom);

    async function handleLogout() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('로그아웃 오류:', error.message);
        } else {
            setUserState({ id: '', name: '' })
        }
    }

    const toggleDrawer =
        (anchor: Anchor, open: boolean) =>
            (event: React.KeyboardEvent | React.MouseEvent) => {
                if (
                    event &&
                    event.type === 'keydown' &&
                    ((event as React.KeyboardEvent).key === 'Tab' ||
                        (event as React.KeyboardEvent).key === 'Shift')
                ) {
                    return;
                }

                setState({ ...state, [anchor]: open });
            };

    const showLoginBox = () => {
        return (
            <Box display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center">
                <h1>환영합니다, {userState.name} 님!</h1>
                <Button variant='contained' onClick={handleLogout}>로그아웃</Button>
            </Box>
        )
    }

    const showMenuList = () => {
        return (
            <List>
                <ListItem key={'weekly'} disablePadding>
                    <ListItemButton onClick={() => { router.push('/calendar') }}>
                        <ListItemIcon>
                            <CalendarMonthIcon />
                        </ListItemIcon>
                        <ListItemText primary={'이번주 시간표'} />
                    </ListItemButton>
                </ListItem>
                <ListItem key={'raid'} disablePadding>
                    <ListItemButton onClick={() => {
                        console.log(userState.id)
                        router.push(`/members/schedule?id=${getBase64Text(userState.id)}`)
                    }}>
                        <ListItemIcon>
                            <CheckBoxIcon />
                        </ListItemIcon>
                        <ListItemText primary={'스케쥴 관리'} />
                    </ListItemButton>
                </ListItem>
            </List>
        )
    }

    const list = (anchor: Anchor) => (
        <Box
            sx={{ width: 'auto', padding: '20px' }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            {userState.id != '' ? showLoginBox() : <h1>로그인해주세요</h1>}

            <Divider sx={{ padding: '10px' }} />

            <List>
                <ListItem key={'main'} disablePadding>
                    <ListItemButton onClick={() => { router.push('/') }}>
                        <ListItemIcon>
                            <CalendarMonthIcon />
                        </ListItemIcon>
                        <ListItemText primary={'메인 화면'} />
                    </ListItemButton>
                </ListItem>
            </List>
            {userState.id != '' && showMenuList()}
        </Box>
    );

    return (
        <div>
            {(['left'] as const).map((anchor) => (
                <React.Fragment key={anchor}>

                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={toggleDrawer(anchor, true)}
                        edge="start"
                        sx={{
                            marginLeft: 2
                        }}>

                        <MenuIcon />

                    </IconButton>

                    <SwipeableDrawer
                        anchor={anchor}
                        open={state[anchor]}
                        onClose={toggleDrawer(anchor, false)}
                        onOpen={toggleDrawer(anchor, true)}>
                        {list(anchor)}
                    </SwipeableDrawer>

                </React.Fragment>
            ))}
        </div>
    );
}