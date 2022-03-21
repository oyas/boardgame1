import { Box, Button, TextField, Typography } from "@mui/material";
import { Game } from "../game/Game";
import Information from "./Information";
import Mountains from "./MountainsField";
import Players from "./Players";
import Products from "./Products";

type Props = {
  game: Game;
  action: (action: string) => void;
  play: (gameId: string, playerName: string) => void;
};

export default function GameMain({ game, action, play }: Props) {
  const playForm = (
    <>
      <TextField id="game-id" label="Game ID" variant="outlined" />
      <TextField id="player-name" label="Player Name" variant="outlined" />
      <Button
        onClick={() => {
          let gameId =
            document.querySelector<HTMLInputElement>("#game-id")?.value;
          let playerName =
            document.querySelector<HTMLInputElement>("#player-name")?.value;
          console.log("gameId:", gameId);
          console.log("playerName:", playerName);
          if (
            gameId !== undefined &&
            playerName !== undefined &&
            gameId != "" &&
            playerName != ""
          ) {
            play(gameId, playerName);
          }
        }}
      >
        Play
      </Button>
    </>
  );

  return (
    <>
      <Box
        sx={{
          my: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          ボードゲーム（仮） {game.gameId}
        </Typography>
      </Box>
      <Box sx={{ display: game.gameId != "" ? "none" : "block" }}>
        {playForm}
      </Box>
      <Box sx={{ display: game.gameId == "" ? "none" : "block" }}>
        <Box margin="5px">
          <Information game={game} action={action}></Information>
        </Box>
        <Box margin="5px">
          <Mountains game={game} action={action}></Mountains>
        </Box>
        <Box margin="5px">
          <Players game={game} action={action}></Players>
        </Box>
        <Box margin="5px">
          <Products game={game} action={action}></Products>
        </Box>
      </Box>
    </>
  );
}