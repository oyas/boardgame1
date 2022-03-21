import { Game, ItemCount, PlayerInfo } from "../game/Game";
import { AssemblingId, Item, ItemsFromActionId, MiningId, SmeltingId } from "../game/Items";

const RequiredPower = [1, 4, 10, 99];

export function doAction(game: Game, player: PlayerInfo, actionId: string): boolean {
  switch (actionId) {
    case 'mountain0':
      return mining(game, player, 0);
    case 'mountain1':
      return mining(game, player, 1);
    case 'mountain2':
      return mining(game, player, 2);
    case 'mountain3':
      return mining(game, player, 3);
    case 'mountain4':
      return mining(game, player, 4);
    case 'skip':
      return finished(game, player);
  }

  let item = ItemsFromActionId.get(actionId);
  if (item === undefined) {
    console.log("unknown action");
    game.information = "unknown action";
    return true;
  }

  switch (item.type) {
    case 'mining':
      // return mining(game, player, item);
      break;
    case 'smelting':
      return smelting(game, player, item);
      break;
    case 'assembling':
      return assembling(game, player, item);
      break;
    case 'levelupper':
      return levelupper(game, player, item);
      break;
    default:
      console.log("ERROR!!!! action type is wrong.", item);
  }
  return false;
}

function mining(game: Game, player: PlayerInfo, index: number): boolean {
  console.log("mining start");
  if (game.phase.phase != 1) {
    game.information = "You can not do it in this phase.";
    return true;
  }

  let used = player.usedMining;
  let machine = findItem(player, MiningId);
  if (machine.count <= used) {
    game.information = "You can not do because of limit.";
    return true;
  }
  let required = requiredPower(used);
  if (required < 0 || player.remainingEnergy < required) {
    game.information = "You can not do because of power.";
    return true;
  }

  console.log("mountain ", game.mountains, index);
  let mountain = game.mountains[index];
  if (mountain === undefined || mountain.count <= 0) {
    game.information = "There are no materials.";
    return true;
  }

  console.log("mining valid");

  player.usedMining += 1;
  player.remainingEnergy -= required;
  mountain.count -= 1;
  let item = findItem(player, mountain.mountainId - 200);
  item.count += 1;
  return false;
}

function smelting(game: Game, player: PlayerInfo, item: Item): boolean {
  console.log("smelting start");
  if (game.phase.phase != 2) {
    game.information = "You can not do it in this phase.";
    return true;
  }

  let used = player.usedSmelting;
  let machine = findItem(player, SmeltingId);
  if (machine.count <= used) {
    game.information = "You can not do because of limit.";
    return true;
  }
  let required = requiredPower(used);
  if (required < 0 || player.remainingEnergy < required) {
    game.information = "You can not do because of power.";
    return true;
  }

  let materialReq = new Map<number, number>();
  for (let id of item.materialIds ?? []) {
    let count = materialReq.get(id) ?? 0;
    materialReq.set(id, count + 1);
  }
  for (let id of item.materialIds ?? []) {
    let myItem = findItem(player, id);
    if (myItem.count < (materialReq.get(id) ?? 10000)) {
      game.information = "You can not do because of materials.";
      return true;
    }
  }

  console.log("smelting valid");

  player.usedSmelting += 1;
  player.remainingEnergy -= required;
  for (let id of item.materialIds ?? []) {
    let myItem = findItem(player, id);
    myItem.count -= 1;
  }
  let myItem = findItem(player, item.id);
  myItem.count += 1;
  return false;
}

function assembling(game: Game, player: PlayerInfo, item: Item): boolean {
  console.log("assembling start");
  if (game.phase.phase != 2) {
    game.information = "You can not do it in this phase.";
    return true;
  }

  let used = player.usedAssembling;
  let machine = findItem(player, AssemblingId);
  if (machine.count <= used) {
    game.information = "You can not do because of limit.";
    return true;
  }
  let required = requiredPower(used);
  if (required < 0 || player.remainingEnergy < required) {
    game.information = "You can not do because of power.";
    return true;
  }

  let materialReq = new Map<number, number>();
  for (let id of item.materialIds ?? []) {
    let count = materialReq.get(id) ?? 0;
    materialReq.set(id, count + 1);
  }
  for (let id of item.materialIds ?? []) {
    let myItem = findItem(player, id);
    if (myItem.count < (materialReq.get(id) ?? 10000)) {
      game.information = "You can not do because of materials.";
      return true;
    }
  }

  console.log("assembling valid");

  player.usedAssembling += 1;
  player.remainingEnergy -= required;
  for (let id of item.materialIds ?? []) {
    let myItem = findItem(player, id);
    myItem.count -= 1;
  }
  let myItem = findItem(player, item.id);
  myItem.count += 1;
  return false;
}

function levelupper(game: Game, player: PlayerInfo, item: Item): boolean {
  if (game.phase.phase != 2) {
    game.information = "You can not do it in this phase.";
    return true;
  }

  let myItem = findItem(player, item.id);
  let required = 0;
  for (let i = 0; i <= myItem.count; i++) {
    required += RequiredPower[i];
  }
  if (required < 0 || player.remainingEnergy < required) {
    game.information = "You can not do because of power.";
    return true;
  }

  let materialReq = new Map<number, number>();
  for (let id of item.materialIds ?? []) {
    let count = materialReq.get(id) ?? 0;
    materialReq.set(id, count + 1);
  }
  for (let id of item.materialIds ?? []) {
    let myItem = findItem(player, id);
    if (myItem.count < (materialReq.get(id) ?? 10000)) {
      game.information = "You can not do because of materials.";
      return true;
    }
  }

  player.remainingEnergy -= required;
  for (let id of item.materialIds ?? []) {
    let myItem = findItem(player, id);
    myItem.count -= 1;
  }
  myItem.count += 1;
  return false;
}

function requiredPower(used: number): number {
  if (used > 3) {
    return -1;
  }
  return RequiredPower[used];
}

export function findItem(player: PlayerInfo, itemId: number): ItemCount {
  for (let ic of player.items) {
    if (ic.id == itemId) {
      return ic;
    }
  }

  // new item
  let item = {
    id: itemId,
    count: 0,
  };
  player.items.push(item);
  return item;
}

function finished(game: Game, player: PlayerInfo): boolean {
  player.finished = true;
  return false;
}
