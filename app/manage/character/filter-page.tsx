import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'
import { Box, Typography, Card, CardContent, Grid, IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';
import { getBase64Text } from '@/utils/TextUtils';

interface FilteredDataProps {
    members: any[] | null
    selectedOption: string
}

export default function CharactersFilterPage(props: FilteredDataProps) {
    const router = useRouter()

    const [filteredData, setFilteredData] = useState<any[]>([])

    const { members, selectedOption } = props

    useEffect(() => {
        async function fetchFilteredData() {
            const { data, error } = await supabase
                .from('Character')
                .select()
                .eq('member_id', parseInt(selectedOption))
                .order('id')

            if (data) {
                setFilteredData(data)
            }
        }

        if (selectedOption) {
            fetchFilteredData()
        } else {
            setFilteredData([])
        }
    }, [selectedOption])

    function makeCharacterCard(character: any) {
        const member = members?.find(member => member.id === character.member_id)
        const bgColor: string = member?.personal_color
        const textColor: string = member?.text_color
        return (
            <Grid item xs={6} lg={3} key={character.id}>
                <Card style={{ backgroundColor: bgColor, color: textColor }} onClick={() => {
                    router.push(`/members/character?id=${getBase64Text(String(character.id))}`)
                }}>
                    <CardContent>
                        <Typography variant="h5">{character.char_name}</Typography>
                        <Box>
                            <Typography variant="body1">{character.char_class}</Typography>
                            <Typography variant="body1">{character.char_level}</Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        )
    }

    return (
        <Box padding={2}>
            <Grid container spacing={2}>
                {
                    filteredData?.filter((item) => {
                        const selectedId = parseInt(selectedOption)
                        return selectedId === item.member_id
                    })?.map((character) => {
                        return makeCharacterCard(character)
                    })

                }
                {
                    selectedOption &&
                    (
                        <Grid item xs={6} lg={3} key={'add char'}>
                            <Card style={{ border: '1px solid #ccc' }} onClick={() => {
                                
                            }}>
                                <CardContent style={{ textAlign: 'center' }}>
                                    <Typography variant="h5">추가</Typography>
                                    <IconButton sx={{
                                        '&:hover': {
                                            backgroundColor: 'transparent',
                                        },
                                    }}>
                                        <AddIcon style={{ fontSize: '31px' }} />
                                    </IconButton>
                                </CardContent>
                            </Card>
                        </Grid>
                    )
                }
            </Grid>
        </Box >
    )
}
