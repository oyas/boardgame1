
export const MiningId = 90;
export const SmeltingId = 91;
export const AssemblingId = 92;

export type Item = {
  id: number;
  actionId: string;
  type: string;
  materialIds?: number[];
  name: string;
  secondary?: string;
  description?: string;
  requirement?: string;
};

export const Mountains: Item[] = [
  {
    id: 200,
    actionId: "mountain0",
    type: "mining",
    name: "鉄鉱山",
    description: "+ 鉄鉱石",
  },
  {
    id: 201,
    actionId: "mountain1",
    type: "mining",
    name: "採石場",
    description: "+ 石",
  },
  {
    id: 202,
    actionId: "mountain2",
    type: "mining",
    name: "銅鉱山",
    description: "+ 銅鉱石",
  },
  {
    id: 203,
    actionId: "mountain3",
    type: "mining",
    name: "炭鉱",
    description: "+ 石炭",
  },
  {
    id: 204,
    actionId: "mountain4",
    type: "mining",
    name: "ウラン鉱山",
    description: "+ ウラン",
  },
];

export const Items: Item[] = [
  // material
  {
    id: 0,
    actionId: "material0",
    type: "mining",
    name: "鉄鉱石",
  },
  {
    id: 1,
    actionId: "material1",
    type: "mining",
    name: "石",
  },
  {
    id: 2,
    actionId: "material2",
    type: "mining",
    name: "銅鉱石",
  },
  {
    id: 3,
    actionId: "material3",
    type: "mining",
    name: "石炭",
  },
  {
    id: 4,
    actionId: "material4",
    type: "mining",
    name: "ウラン",
  },

  // item
  {
    id: 10,
    materialIds: [0],
    actionId: "item10",
    type: "smelting",
    name: "鉄",
    requirement: "精錬窯",
  },
  {
    id: 11,
    materialIds: [1],
    actionId: "item11",
    type: "smelting",
    name: "石材",
    requirement: "精錬窯",
  },
  {
    id: 12,
    materialIds: [2],
    actionId: "item12",
    type: "smelting",
    name: "銅",
    requirement: "精錬窯",
  },

  // product
  {
    id: 20,
    actionId: "item20",
    materialIds: [10, 12],
    type: "assembling",
    name: "モーター",
    description: "",
    requirement: "組立機",
  },
  {
    id: 21,
    actionId: "item21",
    materialIds: [10, 12],
    type: "assembling",
    name: "ICチップ",
    description: "",
    requirement: "組立機",
  },
  {
    id: 22,
    actionId: "item22",
    materialIds: [11, 11],
    type: "assembling",
    name: "シリコン",
    description: "",
    requirement: "組立機",
  },

  // builder
  {
    id: MiningId,  // 90
    actionId: "builder0",
    materialIds: [20, 11],
    type: "levelupper",
    name: "採掘機",
    description: "採掘機のレベル +1",
    requirement: "次のレベルで使用する電力",
  },
  {
    id: SmeltingId,  // 91
    actionId: "builder1",
    materialIds: [10, 10, 11],
    type: "levelupper",
    name: "精錬窯",
    description: "精錬窯のレベル +1",
    requirement: "次のレベルで使用する電力",
  },
  {
    id: AssemblingId,  // 92
    actionId: "builder2",
    materialIds: [20, 21],
    type: "levelupper",
    name: "組立機",
    description: "組立機のレベル +1",
    requirement: "次のレベルで使用する電力",
  },

  // power
  {
    id: 100,
    actionId: "power0",
    materialIds: [11, 12],
    type: "assembling",
    name: "風力発電所",
    description: "エネルギー +2",
    requirement: "組立機",
  },
  {
    id: 101,
    actionId: "power1",
    materialIds: [11, 12],
    type: "assembling",
    name: "水力発電所",
    description: "エネルギー +4 (ダムがあれば、さらに+4)",
    requirement: "組立機",
  },
  {
    id: 102,
    actionId: "power2",
    materialIds: [11, 12],
    type: "assembling",
    name: "火力発電所",
    description: "エネルギー +15",
    requirement: "組立機",
  },
  {
    id: 103,
    actionId: "power3",
    materialIds: [11, 12],
    type: "assembling",
    name: "原子力発電所",
    description: "エネルギー +40",
    requirement: "組立機",
  },

];

export const ItemsFromActionId = new Map<string, Item>(
  Items.map((item) => [item.actionId, item])
);

export const ItemsFromId = new Map<number, Item>(
  Items.map((item) => [item.id, item])
);

export const PowerPlants: {id: number, gen: number}[] = [
  {id: 100, gen: 2},
  {id: 101, gen: 4},
  {id: 102, gen: 15},
  {id: 103, gen: 40},
];
