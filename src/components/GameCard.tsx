import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { ReactNode } from "react";

type Props = {
  materials?: string;
  name: string;
  secondary?: string;
  action: () => void;
  children?: ReactNode;
  requirement?: string;
};

export default function GameCard(props: Props) {
  return (
    <Card variant="outlined">
      <CardActionArea onClick={props.action}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {props.materials}
          </Typography>
          <Typography variant="h5" component="div">
            {props.name}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {props.secondary}
          </Typography>
          <Typography variant="body2">
            {props.children}
          </Typography>
          <Typography>
            {props.requirement}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};