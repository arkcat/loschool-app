'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import { supabase } from '@/utils/supabase';
import { MemberData } from '@/lib/database.types';
import CancelIcon from '@mui/icons-material/CancelOutlined'
import CheckIcon from '@mui/icons-material/CheckCircleOutlined';
import { getBase64Text } from '@/utils/TextUtils';
import { useRouter } from 'next/navigation';
import MainPageBox from '@/components/MainPageBox';
import useRequireAuth from '@/utils/AuthUtils';
export const dynamic = 'force-dynamic'

interface Data {
    id: number;
    calories: number;
    carbs: number;
    fat: number;
    name: string;
}

function createData(
    id: number,
    name: string,
    calories: number,
    fat: number,
    carbs: number,
): Data {
    return {
        id,
        name,
        calories,
        fat,
        carbs,
    };
}

const rows = [
    createData(1, 'Cupcake', 305, 3.7, 67),
    createData(2, 'Donut', 452, 25.0, 51),
    createData(3, 'Eclair', 262, 16.0, 24),
    createData(4, 'Frozen yoghurt', 159, 6.0, 24),
    createData(5, 'Gingerbread', 356, 16.0, 49),
    createData(6, 'Honeycomb', 408, 3.2, 87),
    createData(7, 'Ice cream sandwich', 237, 9.0, 37),
    createData(8, 'Jelly Bean', 375, 0.0, 94),
    createData(9, 'KitKat', 518, 26.0, 65),
    createData(10, 'Lollipop', 392, 0.2, 98),
    createData(11, 'Marshmallow', 318, 0, 81),
    createData(12, 'Nougat', 360, 19.0, 9),
    createData(13, 'Oreo', 437, 18.0, 63),
];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
    disablePadding: boolean;
    id: keyof Data;
    label: string;
    numeric: boolean;
}

const headCells: readonly HeadCell[] = [
    {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: '닉네임',
    },
    {
        id: 'calories',
        numeric: true,
        disablePadding: false,
        label: '권한',
    },
    {
        id: 'fat',
        numeric: true,
        disablePadding: false,
        label: '컬러',
    },
    {
        id: 'carbs',
        numeric: true,
        disablePadding: false,
        label: '스케쥴',
    },
];

interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler =
        (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}


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
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Data>('calories');

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Data,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    function routeMemberDetails(id: string): void {
        router.push(`/members/details?id=${getBase64Text(id)}&caller=manager`)
    }

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
                            <TableCell align="right" style={{ fontFamily: 'SUIT-Regular', fontWeight: 800, width: '15%' }}>권한</TableCell>
                            <TableCell align="right" style={{ fontFamily: 'SUIT-Regular', fontWeight: 800, width: '15%' }}>컬러</TableCell>
                            <TableCell align="right" style={{ fontFamily: 'SUIT-Regular', fontWeight: 800, width: '15%', paddingRight: '15px' }}>스케쥴</TableCell>
                            <TableCell align="center" style={{ fontFamily: 'SUIT-Regular', fontWeight: 800, width: '30%', paddingRight: '15px' }}>코멘트</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {members.map((row, index) => {
                            const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                                <TableRow hover tabIndex={-1} key={row.id} sx={{ cursor: 'pointer' }} onClick={() => { routeMemberDetails(row.uid) }}>
                                    <TableCell component="th" id={labelId} scope="row" style={{ padding: 15, fontFamily: 'S-CoreDream-3Light' }}>{row.nick_name}</TableCell>
                                    <TableCell align="right" style={{ fontFamily: 'S-CoreDream-3Light' }}>{row.permission}</TableCell>
                                    <TableCell align="right" style={{ backgroundColor: row.personal_color, color: row.text_color, fontFamily: 'S-CoreDream-3Light' }}>{row.personal_color}</TableCell>
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