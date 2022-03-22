import { Box, Button, Grid, TextField, Typography, Stack } from "@mui/material";
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
    <Box width="500px" margin="auto">
      <Stack spacing={1}>
        <TextField id="game-id" label="Game ID" variant="outlined" />
        <TextField id="player-name" label="Player Name" variant="outlined" />
        <Button variant="contained"
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
      </Stack>
    </Box>
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
          ネオクリア（仮） {game.gameId}
        </Typography>
      </Box>
      <Box sx={{ display: game.gameId != "" ? "none" : "block" }}>
        {playForm}
      </Box>
      <Box sx={{ display: game.gameId == "" ? "none" : "block" }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box margin="5px">
              <Information game={game} action={action}></Information>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box margin="5px">
              <Mountains game={game} action={action}></Mountains>
            </Box>
          </Grid>
          <Grid item xs={12} xl={6}>
            <Box margin="5px">
              <Players game={game} action={action}></Players>
            </Box>
          </Grid>
          <Grid item xs={12} xl={6}>
            <Box margin="5px">
              <Products game={game} action={action}></Products>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <hr />
      <Box>
        <Typography>
          発電所を建築して、電力50を達成することを目指すゲームです。<br />
          各ターンは、2つのフェーズがあります。<br />
          1. 採掘 : 山フィールドにある資源をサイコロの目の少ない人からドラフトを行い取得します。<br />
          2. 精錬・組立・レベルアップ : 必要な素材を消費して生成物をを得ます。レベルアップは、採掘機・精錬機・組立機の利用可能回数を増やします。<br />
          <br />
          採掘の行動回数<br />
          サイコロの目の数 ÷ 2 (切り上げ) までのレベルの採掘機を稼働させることができます。
          レベルの高い採掘機を持っていてもサイコロの目が小さいと稼働できないので注意してください。
          サイコロの目の小さい順に鉱山を一つずつ選んでいき、資源が残っていれば獲得します。採掘の回数が残っていれば、2周目・3周目を行います。
          <br />

          <br />
          採掘機・精錬機・組立機のレベルは、使用回数と消費電力が異なります。レベル上げを行なっても低いレベルとみなして使用することが可能です。<br />
          Lv1: 電力  1 を消費して 1 回実行できる <br />
          Lv2: 電力  5 を消費して 2 回実行できる <br />
          Lv3: 電力 15 を消費して 3 回実行できる <br />
          レベルアップを行う際は、素材と次のレベルで消費する電力と同じ電力を消費します。
        </Typography>
      </Box>
    </>
  );
}
