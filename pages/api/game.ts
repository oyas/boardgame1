// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Game, gameDefaultData, GamePlayActionId, MountainInfo, newGame, newPlayerInfo } from '../../src/game/Game';
import { AssemblingId, MiningId, PowerPlants, SmeltingId } from '../../src/game/Items';
import { count, doAction } from '../../src/server/action';


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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Game>
) {
  if (req.method === 'POST') {
    console.log("post req", req.url);
    post(req, res);
    console.log("post end", games);
  } else {
    get(req, res);
  }
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
    console.log("doAction finished", failed, game);
    if (game.information != "") {
      console.log("information", game.information);
    }
    if (failed) {
      console.log("action failed:", game.information);
      response(res, game, gameReq.playerId);
    } else {
      checkFinished(game);
      nextPlayer(game, false);
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

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function initTurn(game: Game) {
  console.log("initTurn start");
  calcPower(game);
  resetUsedCount(game);
  if (game.phase.phase == 0) {
    // reset
    mountainQueue.set(game.gameId, []);
  }
  nextMountains(game);
  dice(game);
  nextPlayer(game, true);
  console.log("initTurn:", game);
}

function dice(game: Game) {
  if (game.phase.phase != 1) {
    return;
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
    if (queue.length == 0) {
      queue = shuffleMountains(game.gameId);
    }
    let last = queue.pop();
    if (last !== undefined) {
      last.index = i;
      last.count = 2;
      game.mountains.push(last);
    } else {
      console.log("ERROR!! mountain queue is empty");
    }
  }
}

function shuffleMountains(gameId: string): MountainInfo[] {
  console.log("shuffleMountains: gameId=" + gameId);
  let order = [];
  let num = AllMountains.length;
  for (let i = 0; i < num; i++) {
    order.push({a: 0, b: Math.random(), index: i});
  }

  order.sort(comp);

  let queue = [];
  for (let i = 0; i < num; i++) {
    let id = AllMountains[order[i].index];
    queue.push({
      index: -1,
      mountainId: id,
      count: 0,
    });
  }
  mountainQueue.set(gameId, queue);
  return queue;
}

function checkFinished(game: Game) {
  for (let player of game.players) {
    if (game.phase.phase == 1 && player.usedMining == count(player, MiningId)) {
      player.finished = true;
    }
    if (
      game.phase.phase == 2 &&
      ((player.usedSmelting == count(player, SmeltingId) &&
        player.usedAssembling == count(player, AssemblingId) &&
        player.remainingEnergy < 5) ||
        player.remainingEnergy == 0)
    ) {
      player.finished = true;
    }
  }
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
  }
  switch (game.phase.phase) {
    case 0:
      game.phase.phase = 1;
      break;
    case 1:
      game.phase.phase = 2;
      break;
    case 2:
      game.phase.phase = 1;
      game.phase.turn += 1;
      break;
  }
  if (game.phase.phase == 1) {
    initTurn(game);
  }
}

function calcPower(game: Game) {
  let winner = -1;
  let mxPower = 49;
  for (let player of game.players) {
    let power = 0;
    for (let plant of PowerPlants) {
      let cnt = count(player, plant.id);
      let dam = Math.min(count(player, plant.dam), cnt) * 4;
      power += cnt * plant.gen + dam;
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

function resetUsedCount(game: Game) {
  for (let player of game.players) {
    player.usedMining = 0;
    player.usedSmelting = 0;
    player.usedAssembling = 0;
  }
}

function clearInformation(game: Game) {
  if (game.winner >= 0) {
    game.information = game.players[game.winner].name + "の勝利!!";
  } else {
    game.information = "";
  }
}

function nextPlayer(game: Game, first: boolean) {
  console.log("nextPlayer");
  let curPlayer = game.players[Math.max(0, game.phase.playerId)];
  let order = curPlayer.order;
  if (first) {
    order = 0;
  }
  for (let i = 0; i < game.players.length; i++) {
    if (order >= game.players.length || order < 0) {
      order = 0;
    }
    order += 1;
    for (let player of game.players) {
      if (player.order == order) {
        curPlayer = player;
        break;
      }
    }
    if (!curPlayer.finished) {
      break;
    }
  }
  game.phase.playerId = curPlayer.playerId;
}
