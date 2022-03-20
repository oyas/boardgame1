import { Box, Typography } from "@mui/material";
import { Game } from "../game/Game";
import GameCard from "./GameCard";

type Props = {
  game: Game;
  action: (action: string) => void;
};

export default function Information({game, action}: Props) {
  return (
    <Box>
      <Box style={{ background: "#e5a729" }} width="100%">
        <Typography sx={{ fontSize: 24 }}>{game.information}</Typography>
      </Box>
      <Box width="150px">
        <GameCard name="Skip" action={() => action("skip")}></GameCard>
      </Box>
    </Box>
  );
}