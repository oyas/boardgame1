// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Game, gameDefaultData, GamePlayActionId, MountainInfo, newGame, newPlayerInfo } from '../../src/game/Game';
import { PowerPlants } from '../../src/game/Items';
import { doAction, findItem } from '../../src/server/action';


const AllMountains = [
  200, 200, 200, 200, 200, 200,  // 鉄鉱山    x 6
  201, 201, 201, 201, 201,       // 採石場    x 5
  202, 202, 202, 202,            // 銅鉱山    x 4
  203, 203, 203,                 // 炭鉱      x 3
  204, 204,                      // ウラン鉱山 x 2
];

type ActionRequest = {
  gameId: string,
  playerId: number,
  action: string,
  playerName?: string,
};

let games = new Map<string, Game>([[gameDefaultData.gameId, gameDefaultData]]);

let mountainQueue = new Map<string, MountainInfo[]>([[gameDefaultData.gameId, []]]);

let mutex = 0;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Game>
) {
  console.log("req", req.url);
  while (mutex != 0) {
    console.log("mutex", mutex);
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  mutex = 1;
  if (req.method === 'POST') {
    post(req, res);
  } else {
    get(req, res);
  }
  mutex = 0;
  console.log("req finished", req.url);
};

function post(
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
    if (game.information != "") {
      console.log("information", game.information);
    }
    if (failed) {
      console.log("action failed:", game.information);
      response(res, game, gameReq.playerId);
      // res.status(400).end();
    } else {
      checkFinished(game);
      response(res, game, gameReq.playerId);
    }
  } else {
    console.log("game or player does not found.");
    res.status(404).end();
  }
}

function get(
  req: NextApiRequest,
  res: NextApiResponse<Game>
) {
  let gameId = req.query["gameId"];
  if (typeof gameId !== "string") {
    res.status(404).end();
    return;
  }
  let playerIdStr = req.query["playerId"];
  if (typeof playerIdStr !== "string" || playerIdStr == "") {
    res.status(404).end();
    return;
  }
  let playerId = parseInt(playerIdStr);

  let game = games.get(gameId);
  if (game !== undefined && 0 <= playerId && playerId < game.players.length) {
    clearInformation(game);
    response(res, game, playerId);
  } else {
    res.status(404).end();
  }
}

function response(res: NextApiResponse<Game>, game: Game, me: number) {
  let ret = JSON.parse(JSON.stringify(game));
  ret.me = me;
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
  // console.log("search game:", game, games);
  if (game === undefined) {
    // new game
    console.log("Create new game:", req.gameId);
    game = newGame(req.gameId, "");
    games.set(game.gameId, game);
    console.log(games);
  } else {
    // join game
    console.log("Join the game:", req.playerName);
  }
  let playerId = addPlayer(game, req.playerName);
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

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function initTurn(game: Game) {
  calcPower(game);
  if (game.phase.phase == 0) {
    // reset
    mountainQueue.set(game.gameId, []);
  }
  nextMountains(game);
  dice(game);
  console.log("initTurn:", game);
}

function dice(game: Game) {
  if (game.phase.phase != 0) {
    return
  }
  let num = game.players.length;
  let order = [];
  for (let i = 0; i < num; i++) {
    let dice = getRandomInt(6) + 1;
    game.players[i].dice = dice;
    order.push({a: dice, b: Math.random(), index: i});
  }
  order.sort(comp);
  for (let i = 0; i < num; i++) {
    game.players[order[i].index].order = i + 1;
  }
  game.phase.playerId = order[0].index;
}

type CS = {
  a: number;
  b: number;
  index: number;
};

function comp(a: CS, b: CS) {
  if (a.a > b.a) {
      return 1;
    }
    if (a.a < b.a) {
      return -1;
    }
    if (a.b > b.b) {
      return 1;
    }
    if (a.b < b.b) {
      return -1;
    }
    return 0;

}

function nextMountains(game: Game) {
  // reset field
  game.mountains = [];

  // get from queue
  let queue = mountainQueue.get(game.gameId);
  if (queue === undefined) {
    queue = [];
    mountainQueue.set(game.gameId, queue);
  }
  let num = game.players.length + 1;
  for (let i = 0; i < num; i++) {
    let last = queue.pop();
    if (last === undefined) {
      shuffleMountains(game.gameId);
      last = queue.pop();
    }
    if (last !== undefined) {
      last.index = i;
      last.count = 2;
      game.mountains.push(last);
    }
  }
}

function shuffleMountains(gameId: string) {
  let order = [];
  let num = AllMountains.length;
  for (let i = 0; i < num; i++) {
    order.push({a: 0, b: Math.random(), index: i});
  }

  order.sort(comp);

  let queue = mountainQueue.get(gameId);
  if (queue === undefined) {
    queue = [];
  }

  for (let i = 0; i < num; i++) {
    let id = AllMountains[order[i].index];
    queue.push({
      index: -1,
      mountainId: id,
      count: 0,
    });
  }
  mountainQueue.set(gameId, queue);
}

function checkFinished(game: Game) {
  let finished = true;
  for (let player of game.players) {
    finished &&= player.finished;
  }
  if (finished) {
    nextPhase(game);
  }
}

function nextPhase(game: Game) {
  for (let player of game.players) {
    player.finished = false;
    player.usedMining = 0;
    player.usedSmelting = 0;
    player.usedAssembling = 0;
  }
  switch (game.phase.phase) {
    case 0:
      game.phase.phase = 1;
      break;
    case 1:
      game.phase.phase = 2;
      break;
    case 2:
      initTurn(game);
      game.phase.phase = 1;
      game.phase.turn += 1;
      break;
  }
}

function calcPower(game: Game) {
  let winner = -1;
  let mxPower = 49;
  for (let player of game.players) {
    let power = 0;
    for (let plant of PowerPlants) {
      let myItem = findItem(player, plant.id);
      power += myItem.count * plant.gen;
    }
    player.power = power;
    player.remainingEnergy = power;
    if (mxPower < power) {
      winner = player.playerId;
      mxPower = power;
    }
  }
  if (winner >= 0) {
    game.winner = winner;
    clearInformation(game);
  }
}

function clearInformation(game: Game) {
  if (game.winner >= 0) {
    game.information = game.players[game.winner].name + "の勝利!!";
  } else {
    game.information = "";
  }
}
