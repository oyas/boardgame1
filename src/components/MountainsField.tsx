import { Grid } from "@mui/material";
import { Game } from "../game/Game";
import { Mountains } from "../game/Items";
import GameCard from "./GameCard";

type Props = {
  game: Game;
  action: (action: string) => void;
};

export default function MountainsField({game, action}: Props) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={0} md={1}></Grid>
      {game.mountains.map((mountain) => {
        let m = Mountains.filter((m) => m.id == mountain.mountainId)[0];
        return (
          <Grid item xs={4} md={2} key={mountain.index}>
            <GameCard name={m.name} action={() => action(m.actionId)} secondary={"残り " + mountain.count}>
              {m.description}
            </GameCard>
          </Grid>
        );
      })}
    </Grid>
  );
}