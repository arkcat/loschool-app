import * as React from 'react'

import Box from '@mui/material/Box'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import CheckBoxIcon from '@mui/icons-material/CheckBoxOutlined'
import MainIcon from '@mui/icons-material/HomeOutlined'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonthOutlined'
import ManageMemberIcon from '@mui/icons-material/ManageAccountsOutlined'
import ManageCharacterIcon from '@mui/icons-material/ManageAccountsSharp'
import PartyIcon from '@mui/icons-material/AppRegistrationOutlined';
import ManageRaidIcon from '@mui/icons-material/ManageSearchOutlined'
import MenuIcon from '@mui/icons-material/Menu'
import userAtom from '@/recoil/userAtom'

import { useRecoilState } from 'recoil'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'next/navigation'
import { getBase64Text } from '@/utils/TextUtils'
import { useEffect } from 'react'
import { Typography } from '@mui/material'

type Anchor = 'left'

export default function SwipeableTemporaryDrawer() {
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    })

    const router = useRouter()

    const [userState, setUserState] = useRecoilState<any | null>(userAtom)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const authSession = supabase.auth.getSession()
                console.log(authSession)
                const currentSession = (await authSession).data.session
                if (currentSession !== null) {
                    getLoginMember(currentSession.user.id)
                } else {
                    setUserState(null)
                }
            } catch (error: any) {
                console.error('사용자 정보 가져오기 오류:', error.message)
            }
        }

        fetchUser()
    }, [])

    const getLoginMember = async (uid: string) => {
        try {
            console.log(`fetch members ${uid}`)
            const { data, error } = await supabase
                .from('Member')
                .select('id, uid, nick_name')
                .eq('uid', uid)

            if (error) {
                throw error
            }

            if (data.length === 1) {
                setUserState(data[0])
            }
        } catch (error: any) {
            console.error('Error updating member:', error.message)
        }
    }

    async function handleLogout() {
        const { error } = await supabase.auth.signOut()
        if (error) {
            console.error('로그아웃 오류:', error.message)
        } else {
            setUserState(null)
            router.push('/')
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
                    return
                }

                setState({ ...state, [anchor]: open })
            }

    const showLoginBox = () => {
        return (
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                gap={1}
            >
                <Typography variant='h6'>환영합니다,</Typography>
                <Typography variant='h5'>{userState.nick_name} 님!</Typography>
                <Button variant='contained' onClick={handleLogout} disableFocusRipple>탈출의 노래</Button>
            </Box>
        )
    }

    const showMenuList = () => {
        return (
            <List>
                <ListItem key={'weekly'} disablePadding>
                    <ListItemButton onClick={() => { router.push(`/calendar?id=${getBase64Text(userState.uid)}`) }}>
                        <ListItemIcon>
                            <CalendarMonthIcon />
                        </ListItemIcon>
                        <ListItemText primary={'이번주 시간표'} />
                    </ListItemButton>
                </ListItem>
                <ListItem key={'schedule'} disablePadding>
                    <ListItemButton onClick={() => { router.push(`/members/schedule?id=${getBase64Text(userState.uid)}`) }}>
                        <ListItemIcon>
                            <CheckBoxIcon />
                        </ListItemIcon>
                        <ListItemText primary={'스케쥴 관리'} />
                    </ListItemButton>
                </ListItem>
                <ListItem key={'attend'} disablePadding>
                    <ListItemButton onClick={() => { router.push(`/members/attend?id=${getBase64Text(userState.uid)}`) }}>
                        <ListItemIcon>
                            <CheckBoxIcon />
                        </ListItemIcon>
                        <ListItemText primary={'출석부'} />
                    </ListItemButton>
                </ListItem>
            </List>
        )
    }

    const showManageMenuList = () => {
        return (
            <List>
                <ListItem key={'manage member'} disablePadding>
                    <ListItemButton onClick={() => { router.push('/manage/member') }}>
                        <ListItemIcon>
                            <ManageMemberIcon />
                        </ListItemIcon>
                        <ListItemText primary={'멤버 관리'} />
                    </ListItemButton>
                </ListItem>
                <ListItem key={'manage character'} disablePadding>
                    <ListItemButton onClick={() => {
                        router.push(`/manage/character`)
                    }}>
                        <ListItemIcon>
                            <ManageCharacterIcon />
                        </ListItemIcon>
                        <ListItemText primary={'캐릭터 관리'} />
                    </ListItemButton>
                </ListItem>
                <ListItem key={'manage raid'} disablePadding>
                    <ListItemButton onClick={() => {
                        router.push(`/manage/raid`)
                    }}>
                        <ListItemIcon>
                            <ManageRaidIcon />
                        </ListItemIcon>
                        <ListItemText primary={'레이드 관리'} />
                    </ListItemButton>
                </ListItem>
                <ListItem key={'manage partyt'} disablePadding>
                    <ListItemButton onClick={() => {
                        router.push(`/manage/party`)
                    }}>
                        <ListItemIcon>
                            <PartyIcon />
                        </ListItemIcon>
                        <ListItemText primary={'파티 편성'} />
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
            {userState ? showLoginBox() : <h1>로그인해주세요</h1>}

            <Divider sx={{ padding: '10px' }} />

            <List>
                <ListItem key={'main'} disablePadding>
                    <ListItemButton onClick={() => { router.push('/') }}>
                        <ListItemIcon>
                            <MainIcon />
                        </ListItemIcon>
                        <ListItemText primary={'메인 화면'} />
                    </ListItemButton>
                </ListItem>
            </List>
            {(userState?.permission === 'senior' || userState?.permission === 'professor') && showMenuList()}
            {userState?.permission === 'professor' && showManageMenuList()}
        </Box>
    )

    return (
        <div>
            {(['left'] as const).map((anchor) => (
                <React.Fragment key={anchor}>

                    <Button
                        color="inherit"
                        onClick={toggleDrawer(anchor, true)}
                        sx={{
                            marginLeft: 2,
                            '&:hover': {
                                backgroundColor: 'transparent',
                            },
                        }}
                        disableRipple
                    >
                        <MenuIcon sx={{ width: 40, height: 40, margin: 1 }} />
                        <Typography variant='h4'>{userState?.nick_name}</Typography>
                    </Button>

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
    )
}