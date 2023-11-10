import { Card, Typography, CardContent, Grid } from "@mui/material";

export interface Reward {
  step: number;
  gold: number;
  item: {
    name: string;
    count: number;
  }[]
}

export interface RaidReward {
  name: string;
  normal: {
    totalGold: number
    reward: Reward[];
  };
  hard: {
    totalGold: number;
    reward: Reward[];
  };
}


interface RaidInfoProps {
  raid: RaidReward;
}

const RaidInfo: React.FC<RaidInfoProps> = ({ raid }) => {
  const { name, normal, hard } = raid;

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" component="div" style={{ fontFamily: 'SUIT-Regular' }}>
          {name}
        </Typography>
        <Grid container spacing={1} padding={2}>
          <Grid xs={6} borderRight={1} padding={1}>
            <Typography variant="h5" color="text.secondary" style={{ fontFamily: 'SUIT-Regular' }}>
              노말: {normal.totalGold}
            </Typography>
            {normal.reward.map((reward, index) => (
              <Typography color="text.secondary" style={{ fontFamily: 'SUIT-Regular', fontWeight: '200', fontSize: '15px' }}>
                관문: {reward.step} / 골드: {reward.gold}<br />
                아이템: {reward.item.map((item, index) => `${item.name} ${item.count}개 `)}
              </Typography>
            ))}
          </Grid>
          <Grid xs={6} borderLeft={1} padding={1}>
            {hard.totalGold > 0 && (
              <Typography variant="h5" color="text.secondary" style={{ fontFamily: 'SUIT-Regular' }}>
                하드: {hard.totalGold}
              </Typography>
            )}
            {hard.reward.map((reward, index) => (
              <Typography color="text.secondary" style={{ fontFamily: 'SUIT-Regular', fontWeight: '200', fontSize: '15px' }}>
                관문: {reward.step} / 골드: {reward.gold}<br />
                아이템: {reward.item.map((item, index) => `${item.name} ${item.count}개 `)}
              </Typography>
            ))}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default RaidInfo;