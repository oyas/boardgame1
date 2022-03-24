import { NextApiRequest, NextApiResponse } from "next";
import { Game, gameDefaultData, GamePlayActionId, newGame, newPlayerInfo } from "../game/Game";
import { doAction } from "./action";
import { checkFinished, clearInformation, initTurn, nextPlayer } from "./turn";

type ActionRequest = {
  gameId: string,
  playerId: number,
  action: string,
  playerName?: string,
};

let games = new Map<string, Game>([[gameDefaultData.gameId, gameDefaultData]]);

export function post(
  req: NextApiRequest,
  res: NextApiResponse<Game>
) {
  console.log("POST /api/game:", JSON.stringify(req.body));
  let gameReq = req.body as ActionRequest;

  // play game
  if (gameReq.action == GamePlayActionId) {
    let { game, playerId } = gamePlay(gameReq);
    if (game === undefined) {
      console.log("can't play game");
      res.status(400).end();
    } else {
      response(res, game, playerId);
    }
    return;
  }

  // normal action
  let game = games.get(gameReq.gameId);
  if (game !== undefined && 0 <= gameReq.playerId && gameReq.playerId < game.players.length) {
    game.name = gameReq.action;
    let player = game.players[gameReq.playerId];
    let failed = doAction(game, player, gameReq.action);
    console.log("doAction finished", failed, game);
    if (game.information != "") {
      console.log("information", game.information);
    }
    if (failed) {
      console.log("action failed:", game.information);
      response(res, game, gameReq.playerId);
    } else {
      if (game.phase.phase == 1) {
        nextPlayer(game);
      }
      if (game.phase.special == 0) {
        checkFinished(game);
      }
      response(res, game, gameReq.playerId);
    }
  } else {
    console.log("game or player does not found.");
    res.status(404).end();
  }
}

export function get(
  req: NextApiRequest,
  res: NextApiResponse<Game>
) {
  let gameId = req.query["gameId"];
  if (typeof gameId !== "string") {
    console.log("gameId is not string");
    res.status(404).end();
    return;
  }
  let playerIdStr = req.query["playerId"];
  if (typeof playerIdStr !== "string" || playerIdStr == "") {
    console.log("playerId is not set");
    res.status(404).end();
    return;
  }
  let playerId = parseInt(playerIdStr);

  let game = games.get(gameId);
  if (game !== undefined && 0 <= playerId && playerId < game.players.length) {
    clearInformation(game);
    response(res, game, playerId);
  } else {
    console.log("game or user not found.");
    res.status(404).end();
  }
}

function response(res: NextApiResponse<Game>, game: Game, me: number) {
  let ret = JSON.parse(JSON.stringify(game));
  ret.me = me;
  for (let i = 0; i < game.players.length; i++) {
    ret.players[i].items = [...game.players[i].items]; // JSON.stringfy does not work for Map
  }
  ret.time = new Date().toISOString();
  res.status(200).json(ret);
}

function gamePlay(req: ActionRequest): {game: Game | undefined, playerId: number} {
  if (
    req.gameId === undefined ||
    req.playerName === undefined ||
    req.gameId == "" ||
    req.playerName == ""
  ) {
    return { game: undefined, playerId: -1 };
  }
  let game = games.get(req.gameId);
  if (game === undefined) {
    // new game
    console.log("Create new game:", req.gameId);
    game = newGame(req.gameId, "");
    games.set(game.gameId, game);
  } else {
    // join game
    console.log("Join the game:", req.playerName);
  }
  let playerId = addPlayer(game, req.playerName);
  console.log(games);
  return { game, playerId };
}

function addPlayer(game: Game, playerName: string): number {
  for (let player of game.players) {
    if (player.name == playerName) {
      return player.playerId
    }
  }
  let player = newPlayerInfo(game.players.length, playerName);
  game.players.push(player);

  initTurn(game);

  return player.playerId;
}
