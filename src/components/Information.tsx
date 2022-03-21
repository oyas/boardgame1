import { Box, Typography } from "@mui/material";
import { Game } from "../game/Game";
import GameCard from "./GameCard";

const phaseMessage = [
  "ゲームを始める準備ができましたら Ready を押してください",
  "さんは、資源を採掘できます。",
  "精錬や組み立てを実行できます。",
];

type Props = {
  game: Game;
  action: (action: string) => void;
};

export default function Information({game, action}: Props) {
  let curPlayer = game.players[game.phase.playerId];
  let curPlayerName = game.phase.phase == 1 ? curPlayer?.name : ""
  return (
    <Box>
      <Box style={{ background: "#e5a729" }} width="100%">
        <Typography sx={{ fontSize: 24 }}>{game.information}</Typography>
      </Box>
      <Box width="100%">
        <Typography sx={{ fontSize: 24 }}>
          {"Turn." + game.phase.turn + "  " + curPlayerName + phaseMessage[game.phase.phase]}
        </Typography>
      </Box>
      <Box width="150px">
        <GameCard
          name={game.phase.phase == 0 ? "Ready" : "Finish"}
          action={() => action("skip")}
        ></GameCard>
      </Box>
    </Box>
  );
}