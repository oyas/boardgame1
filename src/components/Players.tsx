import { Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Game, ItemCount, PlayerInfo } from "../game/Game";
import { ItemsFromId } from "../game/Items";

type Props = {
  game: Game;
  action: (action: string) => void;
};

export default function Players({ game, action }: Props) {
  let itemRows = (player: PlayerInfo) =>
    player.items.map((row) => (
      <TableRow key={row.id}>
        <TableCell>{ItemsFromId.get(row.id)?.name}</TableCell>
        <TableCell align="right">
          {(row.id == 90
            ? (row.count - player.usedMining) + " / "
            : row.id == 91
            ? (row.count - player.usedSmelting) + " / "
            : row.id == 92
            ? (row.count - player.usedAssembling) + " / "
            : "") + row.count}
        </TableCell>
      </TableRow>
    ));

  let players = game.players.map((player) => (
    <Grid item xs={6} md={3} height="100%" key={player.playerId}>
      <Box style={{ border: "solid", padding: "5px" }} height="100%">
        <Typography variant="h3">
          {(player.finished ? "✅ " : "") + player.name}
        </Typography>
        <TableContainer>
          <Table>
            <TableHead></TableHead>
            <TableBody>
              <TableRow key="player_dice">
                <TableCell>サイコロ</TableCell>
                <TableCell align="right">{player.dice}</TableCell>
              </TableRow>
              <TableRow key="player_power">
                <TableCell>電力</TableCell>
                <TableCell align="right">
                  {player.remainingEnergy} / {player.power}
                </TableCell>
              </TableRow>
              {itemRows(player)}
            </TableBody>
          </Table>
        </TableContainer>
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