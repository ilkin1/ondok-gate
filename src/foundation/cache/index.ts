import * as NodeCache from 'node-cache';
import op from "op";

type Key = string;

export interface Cache {
  find<T = any>(key: Key, def?: T): Promise<T | undefined>

  // ttl in seconds
  set<T = any>(key: Key, value: T, ttl: number): void

  forget(key: Key): void

  clear(): void

  del(key: Key): void

  resolve<T = any>(key: Key, callback: () => Promise<T>, ttl: number): Promise<T>
}

const node = new NodeCache();

class HotCache implements Cache {
  async find<T = any>(key: Key, def?: T): Promise<T | undefined> {
    return node.get(key)
  }

  async set<T = any>(key: Key, value: T, ttl: number = 0): Promise<void> {
    await node.set(key, value, ttl);
  }

  del(key: Key) {
    node.del(key)
  }

  async resolve<T = any>(key: Key, callback: () => Promise<T>, ttl: number = 0): Promise<T> {
    const value = await this.find(key);

    if (value !== undefined) return value;

    const result = await callback();

    op.dispatch(() => this.set(key, result, ttl));

    return result;
  }

  forget(key: Key): void {

  }

  async clear(): Promise<void> {
    await node.flushAll()
  }
}

// setInterval(() => {
//   console.log(node.keys())
// }, 1000);

const proc = new HotCache();

async function clear(pattern: string = '*'): Promise<void> {
  // await hot.clear();
  // await redis.clear();
}

export default {
  proc,
  // warm: redis,
  clear
}