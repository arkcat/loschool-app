import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'
import { Box, Typography, Card, CardContent, Grid } from '@mui/material'

interface FilteredDataProps {
    members: any[] | null
    selectedOption: string
}

const FilteredData: React.FC<FilteredDataProps> = ({ members, selectedOption }) => {

    const [filteredData, setFilteredData] = useState<any[]>([])

    useEffect(() => {
        async function fetchFilteredData() {
            let { data, error } = await supabase
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

    return (
        <Box padding={2}>
            <Grid container spacing={2}>
                {filteredData?.filter((item) => {
                    const selectedId = parseInt(selectedOption)
                    return selectedId == item.member_id
                })?.map((character) => {
                    let member = members?.find((member) => {
                        return member.id == character.member_id
                    })
                    let bgColor: string = member?.personal_color
                    let textColor: string = member?.text_color
                    return (
                        <Grid item xs={6} lg={2} key={member.id}>
                            <Card key={character.id} style={{ backgroundColor: bgColor, color: textColor }} >
                                <CardContent>
                                    <Typography variant="h5">
                                        {character.char_name}
                                    </Typography>
                                    <Box >
                                        <Typography variant="body1">
                                            {character.char_class}
                                        </Typography>
                                        <Typography variant="body1">
                                            {character.char_level}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    )
                })}
            </Grid>
        </Box>
    )
}

export default FilteredData