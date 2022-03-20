export type Item = {
  id: number;
  actionId: string;
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
    name: "鉄鉱山",
	description: "+ 鉄鉱石",
  },
  {
    id: 201,
    actionId: "mountain1",
    name: "採石場",
	description: "+ 石",
  },
  {
    id: 202,
    actionId: "mountain2",
    name: "銅鉱山",
	description: "+ 銅鉱石",
  },
  {
    id: 203,
    actionId: "mountain3",
    name: "炭鉱",
	description: "+ 石炭",
  },
  {
    id: 204,
    actionId: "mountain4",
    name: "ウラン鉱山",
	description: "+ ウラン",
  },
];

export const Items: Item[] = [
  // material
  {
    id: 0,
    actionId: "material0",
    name: "鉄鉱石",
  },
  {
    id: 1,
    actionId: "material1",
    name: "石",
  },
  {
    id: 2,
    actionId: "material2",
    name: "銅鉱石",
  },
  {
    id: 3,
    actionId: "material3",
    name: "石炭",
  },
  {
    id: 4,
    actionId: "material4",
    name: "ウラン",
  },

  // item
  {
    id: 10,
    materialIds: [0],
    actionId: "item10",
    name: "鉄",
    requirement: "精錬釜",
  },
  {
    id: 11,
    materialIds: [1],
    actionId: "item11",
    name: "石材",
    requirement: "精錬釜",
  },
  {
    id: 12,
    materialIds: [2],
    actionId: "item12",
    name: "銅",
    requirement: "精錬釜",
  },

  // product
  {
    id: 20,
    actionId: "item20",
    materialIds: [10, 12],
    name: "モーター",
    description: "",
    requirement: "組立機",
  },
  {
    id: 21,
    actionId: "item21",
    materialIds: [10, 12],
    name: "ICチップ",
    description: "",
    requirement: "組立機",
  },
  {
    id: 22,
    actionId: "item22",
    materialIds: [11, 11],
    name: "シリコン",
    description: "",
    requirement: "組立機",
  },

  // power
  {
    id: 100,
    actionId: "power0",
    materialIds: [11, 12],
    name: "風力発電所",
    description: "エネルギー +2",
    requirement: "組立機",
  },
  {
    id: 101,
    actionId: "power1",
    materialIds: [11, 12],
    name: "水力発電所",
    description: "エネルギー +4 (ダムがあれば、さらに+4)",
    requirement: "組立機",
  },
  {
    id: 102,
    actionId: "power2",
    materialIds: [11, 12],
    name: "火力発電所",
    description: "エネルギー +15",
    requirement: "組立機",
  },
  {
    id: 103,
    actionId: "power3",
    materialIds: [11, 12],
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
