import * as React from "react";
import type { NextPage } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@mui/material";
import axios from "axios";
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

  const syncGame = () => {
    if (game.gameId == "") {
      return;
    }
    axios
      .get(baseURL + "?gameId=" + game.gameId + "&playerId=" + game.me)
      .then((response) => {
        setGame(response.data);
      })
      .catch((e) => {
        console.log("syncGame failed:", e);
      })
      .finally(() => {
        if (game.information != "") {
          console.log("information:", game.information);
        }
      });
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
    axios
      .post(baseURL, { action, gameId: game.gameId, playerId: game.me })
      .then((response) => {
        console.log("response of action " + action, response.data);
        setGame(response.data);
      })
      .catch((e) => {
        console.log("action failed:", e);
      })
      .finally(() => {
        if (game.information != "") {
          console.log("information:", game.information);
        }
      });
  }

  function play(gameId: string, playerName: string) {
    let actionId = GamePlayActionId;
    console.log("action", actionId);
    axios
      .post(baseURL, {
        action: actionId,
        gameId: gameId,
        playerName: playerName,
        playerId: -1,
      })
      .then((response) => {
        console.log("response of play game " + actionId, response.data);
        setGame(response.data);
      })
      .catch((e) => {
        console.log("play failed:", e);
      });
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
