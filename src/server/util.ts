
export function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export type CS = {
  a: number;
  b: number;
  index: number;
};

export function comp(a: CS, b: CS) {
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
