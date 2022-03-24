import { Game, gameDefaultData, MountainInfo } from "../game/Game";
import { AssemblingId, MiningId, PowerPlants, SmeltingId } from "../game/Items";
import { count } from "./action";
import { comp, getRandomInt } from "./util";


const AllMountains = [
  200, 200, 200, 200, 200, 200,  // 鉄鉱山    x 6
  201, 201, 201, 201, 201,       // 採石場    x 5
  202, 202, 202, 202,            // 銅鉱山    x 4
  203, 203, 203,                 // 炭鉱      x 3
  204, 204,                      // ウラン鉱山 x 2
];

let mountainQueue = new Map<string, MountainInfo[]>([[gameDefaultData.gameId, []]]);

export function initTurn(game: Game) {
  console.log("initTurn start");
  calcPower(game);
  resetUsedCount(game);
  if (game.phase.phase == 0) {
    // reset
    mountainQueue.set(game.gameId, []);
  }
  nextMountains(game);
  dice(game);
  nextPlayer(game);
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
  game.phase.playerId = -1;
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

export function checkFinished(game: Game) {
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

export function clearInformation(game: Game) {
  if (game.winner >= 0) {
    game.information = game.players[game.winner].name + "の勝利!!";
  } else {
    game.information = "";
  }
}

export function nextPlayer(game: Game) {
  console.log("nextPlayer");
  let curPlayer = game.players[Math.max(0, game.phase.playerId)];
  let order = curPlayer.order;
  if (game.phase.playerId < 0) {
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
