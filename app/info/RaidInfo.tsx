import { Card, Typography, CardContent, Grid, TableContainer, TableRow, TableCell, Box, TableHead, useMediaQuery, TableBody } from "@mui/material";
import GoldIcon from '@/app/res/items/골드.png'
import { StaticImageData } from "next/image";
export interface Reward {
  step: number;
  gold: number;
  item: {
    image: string;
    count: number;
  }[]
}

export interface RaidReward {
  name: string;
  color: string;
  itemLevel: string;
  normal: {
    totalGold: number;
    reward: Reward[];
    moreReward: Reward[];
  };
  hard: {
    totalGold: number;
    reward: Reward[];
    moreReward: Reward[];
  };
}

const GoldImage = () => {
  return (<img src={GoldIcon.src} style={{ width: '20px', marginRight: '5px' }} />)
}

interface ImageIconProps {
  source: string;
  count: number
}
const ImageIcon: React.FC<ImageIconProps> = ({ source, count }) => {
  return (
    <div style={{ display: 'inline-block', marginRight: '10px' }}>
      <img src={source} style={{ width: '20px', marginRight: '5px' }} />x{count}
    </div>
  )
}

interface RaidInfoProps {
  raid: RaidReward;
}

const RaidInfo: React.FC<RaidInfoProps> = ({ raid }) => {
  const isNarrowScreen = useMediaQuery('(max-width:600px)');

  const { name, normal, hard } = raid;

  return (
    <Box display={'flex'}>
      <TableContainer sx={{ mb: '3px', backgroundColor: '#b7bd98', border: '2px solid', borderColor: raid.color }}>
        <TableRow>
          <TableCell rowSpan={2} sx={{ minWidth: '120px', textAlign: 'center', borderRight: '2px solid', borderColor: raid.color }}>
            <Box sx={{ minWidth: '120px' }}>
              <Typography component="div" style={{ fontFamily: 'SUIT-Regular', fontSize: '20px', fontWeight: '600' }}>
                {name}
              </Typography>
              {raid.itemLevel.split('\n').map((line, index) => (
                <Typography key={index} style={{ fontFamily: 'NanumBarunGothic', fontSize: '13px', textAlign: 'center' }}>
                  {line}
                </Typography>
              ))}
            </Box>
          </TableCell>
          <TableRow>
            <TableCell sx={{ minWidth: '120px', textAlign: 'center', border: 'none' }}>
              <Typography style={{ fontFamily: 'SUIT-Regular' }}>
                노말 <GoldImage />{normal.totalGold}
              </Typography>
            </TableCell>
            {!isNarrowScreen && normal.reward.map((reward, index) => (
              <TableRow key={index}>
                <TableCell sx={{ border: 'none' }}>
                  {reward.step}관
                </TableCell>
                <TableCell sx={{ minWidth: '120px', border: 'none' }}>
                  <Typography style={{ fontFamily: 'SUIT-Regular', fontWeight: '200', fontSize: '15px' }}>
                    <GoldImage />{reward.gold}
                  </Typography>
                </TableCell>
                <TableCell sx={{ minWidth: '120px', border: 'none' }}>
                  <Typography style={{ fontFamily: 'SUIT-Regular', fontWeight: '200', fontSize: '15px' }}>
                    {reward.item.map((item, index) => <ImageIcon source={item.image} count={item.count} />)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}

            <TableCell sx={{ border: 'none', width: '1px', padding: '1px', backgroundColor: raid.color }} />

            {!isNarrowScreen && normal.moreReward.map((reward, index) => (
              <TableRow key={index}>
                <TableCell sx={{ minWidth: '120px', border: 'none' }}>
                  <Typography style={{ fontFamily: 'SUIT-Regular', fontWeight: '200', fontSize: '15px' }}>
                    <GoldImage />{reward.gold}
                  </Typography>
                </TableCell>
                <TableCell sx={{ minWidth: '120px', border: 'none' }}>
                  <Typography style={{ fontFamily: 'SUIT-Regular', fontWeight: '200', fontSize: '15px' }}>
                    {reward.item.map((item, index) => <ImageIcon source={item.image} count={item.count} />)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableRow>

          {!isNarrowScreen && hard.totalGold > 0 && (
            <TableRow sx={{ backgroundColor: raid.color }}>
              <TableCell colSpan={4} sx={{ minHeight: '1px', maxHeight: '1px', padding: '1px', border: 'none' }}></TableCell>
            </TableRow>
          )}

          {hard.totalGold > 0 && (
            <TableRow>
              <TableCell sx={{ minWidth: '120px', textAlign: 'center', border: 'none' }}>
                <Typography style={{ fontFamily: 'SUIT-Regular' }}>
                  하드 <GoldImage />{hard.totalGold}
                </Typography>
              </TableCell>
              {!isNarrowScreen && hard.reward.map((reward, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ border: 'none' }}>
                    {reward.step}관
                  </TableCell>
                  <TableCell sx={{ minWidth: '120px', border: 'none' }}>
                    <Typography style={{ fontFamily: 'SUIT-Regular', fontWeight: '200', fontSize: '15px' }}>
                      <GoldImage />{reward.gold}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ minWidth: '120px', border: 'none' }}>
                    <Typography style={{ fontFamily: 'SUIT-Regular', fontWeight: '200', fontSize: '15px' }}>
                      {reward.item.map((item, index) => <ImageIcon source={item.image} count={item.count} />)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}

              <TableCell sx={{ border: 'none', width: '1px', padding: '1px', backgroundColor: raid.color }} />

              {!isNarrowScreen && hard.moreReward.map((reward, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ minWidth: '120px', border: 'none' }}>
                    <Typography style={{ fontFamily: 'SUIT-Regular', fontWeight: '200', fontSize: '15px' }}>
                      <GoldImage />{reward.gold}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ minWidth: '120px', border: 'none' }}>
                    <Typography style={{ fontFamily: 'SUIT-Regular', fontWeight: '200', fontSize: '15px' }}>
                      {reward.item.map((item, index) => <ImageIcon source={item.image} count={item.count} />)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableRow>
          )}
        </TableRow>
      </TableContainer>
    </Box>
  );
};

/**
 * <Grid container spacing={1}>
          <Grid xs={2} textAlign={'center'}>
            <Typography variant="h4" component="div" style={{ fontFamily: 'SUIT-Regular' }}>
              {name}
            </Typography>
          </Grid>
          <Grid container xs={10}>
            <Grid xs={12} padding={1}>
              <Grid xs={6}>
                <Typography variant="h5" style={{ fontFamily: 'SUIT-Regular' }}>
                  노말: {normal.totalGold}
                </Typography>
              </Grid>
              <Grid xs={6}>
                {normal.reward.map((reward, index) => (
                  <Typography style={{ fontFamily: 'SUIT-Regular', fontWeight: '200', fontSize: '15px' }}>
                    관문: {reward.step} / 골드: {reward.gold}<br />
                    아이템: {reward.item.map((item, index) => `${item.name} ${item.count}개 `)}
                  </Typography>
                ))}
              </Grid>
            </Grid>
            <Grid xs={12} padding={1}>
              {hard.totalGold > 0 && (
                <Typography variant="h5" style={{ fontFamily: 'SUIT-Regular' }}>
                  하드: {hard.totalGold}
                </Typography>
              )}
              {hard.reward.map((reward, index) => (
                <Typography style={{ fontFamily: 'SUIT-Regular', fontWeight: '200', fontSize: '15px' }}>
                  관문: {reward.step} / 골드: {reward.gold}<br />
                  아이템: {reward.item.map((item, index) => `${item.name} ${item.count}개 `)}
                </Typography>
              ))}
            </Grid>
          </Grid>
        </Grid>
 */
export default RaidInfo;