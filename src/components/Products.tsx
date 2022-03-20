import { Grid } from "@mui/material";
import { Game } from "../game/Game";
import { Items, ItemsFromId } from "../game/Items";
import GameCard from "./GameCard";

type Props = {
  game: Game;
  action: (action: string) => void;
};

export default function Products({game, action}: Props) {

  let products = (
    <>
      {Items.filter((item) => item.id >= 10).map((item) => {
        let materials = "";
        if (item.materialIds !== undefined && item.materialIds.length > 0) {
          for (let id of item.materialIds) {
            if (materials != "") {
              materials += " + ";
            }
            materials += ItemsFromId.get(id)?.name;
          }
        }
        return (
          <Grid item xs={4} md={2} key={item.id}>
            <GameCard
              materials={materials}
              name={item.name}
              action={() => action(item.actionId)}
              requirement={item.requirement}
            >
              {item.description}
            </GameCard>
          </Grid>
        );})}
    </>
  );

  return (
    <Grid container spacing={2}>
      {products}
    </Grid>
  );
}