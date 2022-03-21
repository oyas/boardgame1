import { Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Game, PlayerInfo } from "../game/Game";
import { AssemblingId, ItemsFromId, MiningId, SmeltingId } from "../game/Items";

type Props = {
  game: Game;
  action: (action: string) => void;
};

export default function Players({ game, action }: Props) {
  let makeRow = (id: string | number, name: string | undefined, value: string | number | undefined) => (
    <TableRow key={id}>
      <TableCell>{name}</TableCell>
      <TableCell align="right" width={70}>{value}</TableCell>
    </TableRow>
  );

  let makeRow2 = (player: PlayerInfo, id: number) =>
    makeRow(id, ItemsFromId.get(id)?.name, new Map(player.items).get(id));

  let itemRows = (player: PlayerInfo) =>
    Array.from(player.items)
      .filter(([id]) => id < 90)
      .sort((a, b) => a[0] - b[0])
      .map(([id, count], index) =>
        makeRow(index, ItemsFromId.get(id)?.name, count)
      );

  let builder = (player: PlayerInfo, id: number, usedCount: number) => {
    let name = "" + ItemsFromId.get(id)?.name;
    let count = new Map(player.items).get(id) ?? 0;
    return makeRow(id, name, (count - usedCount) + " / " + count);
  }

  let players = game.players.map((player) => (
    <Grid item xs={6} md={3} height="100%" key={player.playerId}>
      <Box style={{ border: "solid", padding: "5px" }} height="100%">
        <Typography variant="h3">
          {(player.finished ? "✅ " : "") + player.name}
        </Typography>
        <Grid container spacing={0}>
          <Grid item xs={12} sm={6}>
            <TableContainer>
              <Table>
                <TableBody>
                  {makeRow("player_dice", "サイコロ", "" + player.dice)}
                  {makeRow(
                    "player_power",
                    "電力",
                    player.remainingEnergy + " / " + player.power
                  )}
                  {builder(player, MiningId, player.usedMining)}
                  {builder(player, SmeltingId, player.usedSmelting)}
                  {builder(player, AssemblingId, player.usedAssembling)}
                  {makeRow2(player, 100)}
                  {makeRow2(player, 101)}
                  {makeRow2(player, 102)}
                  {makeRow2(player, 103)}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TableContainer>
              <Table>
                <TableBody>{itemRows(player)}</TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  ));

  return (
    <Box>
      <Grid container spacing={0}>
        {players}
      </Grid>
    </Box>
  );
}