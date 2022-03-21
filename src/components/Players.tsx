import { Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Game, PlayerInfo } from "../game/Game";
import { ItemsFromId } from "../game/Items";

type Props = {
  game: Game;
  action: (action: string) => void;
};

export default function Players({ game, action }: Props) {
  let itemRows = (player: PlayerInfo) =>
    Array.from(player.items).map(([id, count]) => (
      <TableRow key={id}>
        <TableCell>{ItemsFromId.get(id)?.name}</TableCell>
        <TableCell align="right">
          {(id == 90
            ? (count - player.usedMining) + " / "
            : id == 91
            ? (count - player.usedSmelting) + " / "
            : id == 92
            ? (count - player.usedAssembling) + " / "
            : "") + count}
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