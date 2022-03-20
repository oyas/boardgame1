import * as React from 'react';
import type { NextPage } from 'next';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Accordion, AccordionDetails, AccordionSummary, Button, CardActionArea, CardActions } from '@mui/material';
import axios from "axios";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Game, gameDefaultData } from '../src/game/game';
import GameCard from '../src/components/GameCard';


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
};

const Home: NextPage = () => {
  const [game, setGame] = React.useState<Game>(gameDefaultData);

  const syncGame = () => {
    axios.get(baseURL + "?gameId=" + game.gameId).then((response) => {
      setGame(response.data);
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
      .post(baseURL, { action, gameId: game.gameId })
      .then((response) => {
        console.log("response of action " + action, response.data);
        setGame(response.data);
      });
  }

  return (
    <Container maxWidth={false}>
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
          MUI v5 + Next.js with TypeScript example
        </Typography>
      </Box>
      <Box>
        <GameCard name={game.name} action={action}></GameCard>
        <Button>button</Button>
      </Box>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={6} md={8}>
            <GameCard name="c1" action={action}></GameCard>
          </Grid>
          <Grid item xs={6} md={4}>
            <GameCard name="" action={action}></GameCard>
          </Grid>
          <Grid item xs={6} md={4}>
            <GameCard name="" action={action}></GameCard>
          </Grid>
          <Grid item xs={6} md={8}>
            <GameCard name="" action={action}></GameCard>
          </Grid>
        </Grid>
      </Box>
      <p>end</p>
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
