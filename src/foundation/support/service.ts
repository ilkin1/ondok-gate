
export function createService<T extends object>(obj: T): T {
  return Object.create(obj);
}