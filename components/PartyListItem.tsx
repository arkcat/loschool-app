import { PartyData, RaidData, CharacterData } from "@/lib/database.types"
import { Box, ListItem, ListItemText } from "@mui/material"
import questIcon from '@/app/res/Dungeon_Quest_Icon.png'

export interface CombinedData {
  party: PartyData
  raid: RaidData
  members: CharacterData[]
}


interface PartyItemProps {
  memberId: number
  data: CombinedData
}

const PartyListItem: React.FC<PartyItemProps> = ({ memberId, data }) => {
  if (data === undefined) {
    return <Box></Box>
  }
  console.log(data)
  const raidInfo = data.raid
  const isMy = data.members.filter(char => { return char.member_id === memberId }).length > 0
  console.log(memberId, isMy)
  return (
    <ListItem>
      <ListItemText
        primary={
          <Box style={{ display: 'flex', alignItems: 'center', fontFamily: 'NanumBarunGothic', fontSize: '20px' }}>
            <span style={{ lineHeight: '20px', color: 'green' }}>{`${data.party.time}:00`}</span>
            <span style={{ lineHeight: '20px', paddingLeft: '10px' }}>{`${raidInfo.raid_name}`}</span>
            {isMy && <img src={questIcon.src} style={{ width: '25px', marginLeft: '10px' }} />}
          </Box>
        }
      />
    </ListItem>
  )
}

export default PartyListItem