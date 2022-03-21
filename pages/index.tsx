import * as React from "react";
import type { NextPage } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@mui/material";
import axios, { AxiosResponse } from "axios";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Game, gameDefaultData, GamePlayActionId } from "../src/game/Game";
import GameMain from "../src/components/GameMain";

const baseURL = "/api/game";

type TimerCallback = () => void;

function useInterval(callback: TimerCallback, delay: number) {
  const intervalRef = React.useRef<TimerCallback>(() => {});

  React.useEffect(() => {
    intervalRef.current = callback;
  }, [callback]);

  React.useEffect(() => {
    function tick() {
      intervalRef.current();
    }
    const id = setInterval(tick, delay);
    return () => {
      clearInterval(id);
    };
  }, [callback, delay]);
}

const Home: NextPage = () => {
  const [game, setGame] = React.useState<Game>(gameDefaultData);

  const responseHandling = (ax: Promise<AxiosResponse<any, any>>, methodName: string) => {
    ax.then((response) => {
        console.log("response of " + methodName, response.data);
        setGame(response.data);
      })
      .catch((e) => {
        console.log(methodName + " failed:", e);
        if (e.response) {
          game.information = methodName + " failed: " + e.response.status + " " + e.response.data
        } else {
          game.information = methodName + " failed: " + e.message
        }
        setGame(game);
      })
      .finally(() => {
        if (game.information != "") {
          console.log("information:", game.information);
        }
      });
  };

  const syncGame = () => {
    if (game.gameId == "") {
      return;
    }
    responseHandling(
      axios.get(baseURL + "?gameId=" + game.gameId + "&playerId=" + game.me, {
        timeout: 1000,
      }),
      "game sync"
    );
  };

  useInterval(() => {
    console.log("useInterval");
    syncGame();
  }, 2000);

  React.useEffect(() => {
    console.log("useEffect");
    syncGame();
  }, []);

  function action(action: string) {
    console.log("action", action);
    responseHandling(
      axios.post(
        baseURL,
        { action, gameId: game.gameId, playerId: game.me },
        { timeout: 1000 }
      ), "action"
    );
  }

  function play(gameId: string, playerName: string) {
    let actionId = GamePlayActionId;
    console.log("action", actionId);
    responseHandling(
    axios
      .post(baseURL, {
        action: actionId,
        gameId: gameId,
        playerName: playerName,
        playerId: -1,
      }, { timeout : 1000 }), "game play request"
    );
  }

  return (
    <Container maxWidth={false}>
      <GameMain game={game} action={action} play={play}></GameMain>
      <hr />
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          // aria-controls="panel1a-content"
          // id="panel1a-header"
        >
          <Typography>Debug</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <pre>
            <code>{JSON.stringify(game, null, 4)}</code>
          </pre>
        </AccordionDetails>
      </Accordion>
    </Container>
  );
};

export default Home;
