// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Game, gameDefaultData, GamePlayActionId } from '../../src/game/Game';


type ActionRequest = {
  gameId: string,
  action: string,
  playerName?: string,
};

let games = new Map<string, Game>([[gameDefaultData.gameId, gameDefaultData]]);

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Game>
) {
  if (req.method === 'POST') {
    console.log("POST /api/game:", JSON.stringify(req.body));
    let gameReq = req.body as ActionRequest;
    if (gameReq.action == GamePlayActionId) {
      let game = gamePlay(gameReq);
      if (game === undefined) {
        res.status(400)
      } else {
        res.status(200).json(game)
      }
      return;
    }
    let game = games.get(gameReq.gameId);
    if (game !== undefined) {
      game.name = gameReq.action;
      res.status(200).json(game)
    } else {
      res.status(404)
    }
  } else {
    let gameId = req.query["gameId"];
    if (typeof gameId !== 'string') {
      res.status(404)
      return;
    }
    let game = games.get(gameId);
    if (game !== undefined) {
      res.status(200).json(game)
    } else {
      res.status(404)
    }
  }
};

function gamePlay(req: ActionRequest): Game | undefined {
  if (
    req.gameId === undefined ||
    req.playerName === undefined ||
    req.gameId == "" ||
    req.playerName == ""
  ) {
    return undefined;
  }
  let game = games.get(req.gameId);
  if (game === undefined) {
    // new game
  } else {
    // join game

  }
  return game;
}
