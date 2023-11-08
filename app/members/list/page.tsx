'use client'
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { supabase } from '@/utils/supabase';
import { MemberData } from '@/lib/database.types';
import CancelIcon from '@mui/icons-material/CancelOutlined'
import CheckIcon from '@mui/icons-material/CheckCircleOutlined';
import { useRouter } from 'next/navigation';
import MainPageBox from '@/components/MainPageBox';
import useRequireAuth from '@/utils/AuthUtils';
export const dynamic = 'force-dynamic'

export default function EnhancedTable() {
    const router = useRouter()
    const [members, setMembers] = React.useState<MemberData[]>([])

    React.useEffect(() => {
        const fetchMembers = async () => {
            const { data, error } = await supabase
                .from('Member')
                .select()
                .neq('id', 9999)
                .order('id')
            if (error) console.error('Error fetching members:', error)
            else setMembers(data)
        }

        fetchMembers()
    }, [])

    const userSession = useRequireAuth();

    if (!userSession) {
        return <div>Loading...</div>;
    }

    return (
        <MainPageBox>
            <Typography className='page-title'>멤버 관리</Typography>
            <TableContainer component={Paper} sx={{ width: '90%', mb: 5, height: '90dvh', maxWidth: '550px', overflow: 'auto' }}>
                <Table aria-labelledby="tableTitle" size={'small'} stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell scope="row" style={{ padding: 15, fontFamily: 'SUIT-Regular', fontWeight: 800, width: '25%' }}>닉네임</TableCell>
                            <TableCell align="right" style={{ fontFamily: 'SUIT-Regular', fontWeight: 800, width: '15%', paddingRight: '15px' }}>스케쥴</TableCell>
                            <TableCell align="center" style={{ fontFamily: 'SUIT-Regular', fontWeight: 800, width: '60%', paddingRight: '15px' }}>코멘트</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {members.map((row, index) => {
                            const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                                <TableRow hover tabIndex={-1} key={row.id} sx={{ cursor: 'pointer' }}>
                                    <TableCell component="th" id={labelId} scope="row" style={{ backgroundColor: row.personal_color, color: row.text_color, padding:'15px', fontFamily: 'S-CoreDream-3Light' }}>{row.nick_name}</TableCell>
                                    <TableCell align="right" style={{ paddingRight: '15px' }}>
                                        {row.schedule_check === true ? (
                                            <CheckIcon color="success" />
                                        ) : (
                                            <CancelIcon color="error" />
                                        )}
                                    </TableCell>
                                    <TableCell style={{ fontFamily: 'S-CoreDream-3Light', fontWeight: 800, paddingRight: '15px' }}>
                                        {row.comment}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </MainPageBox>
    );
}