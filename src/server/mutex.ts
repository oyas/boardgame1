
let mutex = new Map<string, number>();

export async function lock(gameId: string): Promise<boolean> {
  for (let i = 0; i < 3; i++) {
    if (mutex.get(gameId) != 1) {
      mutex.set(gameId, 1);
      return true;
    }
    console.log("mutex", mutex.get(gameId));
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  console.log("ERROR: cannot lock");
  return false;
}

export function unlock(gameId: string) {
  mutex.set(gameId, 0);
}
