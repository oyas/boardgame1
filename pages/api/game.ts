// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Game } from '../../src/game/Game';
import { get, post } from '../../src/server/game';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Game>
) {
  if (req.method === "POST") {
    console.log("post req", req.url);
    post(req, res);
    console.log("post end", req.url);
  } else {
    get(req, res);
  }
};

