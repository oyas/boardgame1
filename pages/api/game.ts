// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Game, gameDefaultData } from '../../src/game/game';


type ActionRequest = {
  gameId: string,
  action: string,
};

let games = new Map<string, Game>([[gameDefaultData.gameId, gameDefaultData]]);

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Game>
) {
  if (req.method === 'POST') {
    console.log("POST /api/game:", JSON.stringify(req.body));
    let gameReq = req.body as ActionRequest;
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
}
