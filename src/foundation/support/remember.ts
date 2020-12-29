// do not use for functions, that returns undefined!
export default function remember<T extends (...args: any) => any>(func: T): T {
  let result: any = undefined;
  //@ts-ignore
  return (...args) => {
    if (result === undefined) {
      result = func(...args)
    }
    return result;
  }
}
