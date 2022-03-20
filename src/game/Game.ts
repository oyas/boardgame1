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
  power: number;
  items: ItemCount[];
  remainingEnergy: number;
};

export type ItemCount = {
  id: number;
  name: string;
  count: number;
};

export type MountainInfo = {
  index: number;
  mountainId: number;
  count: number;
};

export type PhaseInfo = {
  phase: number;
  playerId: number;
  special: number;
};

export const GamePlayActionId = "play-game";

export const gameDefaultData: Game = {
  gameId: "test",
  roomId: "",
  name: "test",
  me: -1,
  players: [
    {
      playerId: 0,
      name: "Player1",
      dice: 0,
      power: 0,
      items: [
        {
          id: 0,
          name: "鉄",
          count: 2,
        }
      ],
      remainingEnergy: 0,
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
    phase: 0,
    playerId: 0,
    special: 0,
  },
};
