export type Game = {
  gameId: string;
  roomId: string;
  name: string;
  me: number;
  players: PlayerInfo[];
  information: string;
  winner: number;
  mountains: MountainInfo[];
  phase: PhaseInfo;
};

export type PlayerInfo = {
  playerId: number;
  name: string;
  dice: number;
  order: number;
  power: number;
  items: ItemCount[];
  remainingEnergy: number;
  finished: boolean;
  usedMining: number;
  usedSmelting: number;
  usedAssembling: number;
};

export type ItemCount = {
  id: number;
  count: number;
};

export type MountainInfo = {
  index: number;
  mountainId: number;
  count: number;
};

export type PhaseInfo = {
  turn: number;
  phase: number;  // 0: beforeGame, 1: mining, 2: action
  playerId: number;
  special: number;
};

export const GamePlayActionId = "play-game";

export function newGame(gameId: string, roomId: string): Game {
  return {
    gameId: gameId,
    roomId: roomId,
    name: "new",
    me: -1,
    players: [],
    information: "",
    winner: -1,
    mountains: [],
    phase: {
      turn: 0,
      phase: 0,
      playerId: 0,
      special: 0,
    },
  };
};

export function newPlayerInfo(playerId: number, name: string): PlayerInfo {
  return {
    playerId: playerId,
    name: name,
    dice: 0,
    order: 0,
    power: 0,
    items: [
      {
        id: 90,
        count: 1,
      },
      {
        id: 91,
        count: 1,
      },
      {
        id: 92,
        count: 1,
      },
      {
        id: 100,
        count: 1,
      },
    ],
    remainingEnergy: 0,
    finished: false,
    usedMining: 0,
    usedSmelting: 0,
    usedAssembling: 0,
  };
}

export const gameDefaultData: Game = {
  gameId: "",
  roomId: "",
  name: "test",
  me: -1,
  players: [
    {
      playerId: 0,
      name: "Player1",
      dice: 0,
      order: 0,
      power: 0,
      items: [
        {
          id: 0,
          count: 2,
        },
      ],
      remainingEnergy: 0,
      finished: false,
      usedMining: 0,
      usedSmelting: 0,
      usedAssembling: 0,
    },
  ],
  information: "Notice",
  winner: -1,
  mountains: [
    {
      index: 0,
      mountainId: 200,
      count: 2,
    },
    {
      index: 1,
      mountainId: 201,
      count: 2,
    },
    {
      index: 2,
      mountainId: 202,
      count: 2,
    },
    {
      index: 3,
      mountainId: 203,
      count: 2,
    },
    {
      index: 4,
      mountainId: 204,
      count: 2,
    },
  ],
  phase: {
    turn: 0,
    phase: 0,
    playerId: 0,
    special: 0,
  },
};
