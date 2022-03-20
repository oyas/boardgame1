import { Card, CardActionArea, CardContent, Typography } from "@mui/material";

type Props = {
  name: string,
  action: (action: string) => void,
};

export default function GameCard(props: Props) {
  return (
    <Card variant="outlined">
      <CardActionArea onClick={() => props.action(props.name)}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {props.name}
          </Typography>
          <Typography variant="h5" component="div">
            benevolent
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            adjective
          </Typography>
          <Typography variant="body2">
            well meaning and kindly.
            <br />
            {'"a benevolent smile"'}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};