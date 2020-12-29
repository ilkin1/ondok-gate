export default function mem<T extends (...args: any) => any>(func: T): T {
  let result: any = undefined;
  //@ts-ignore
  return function (...args) {
    if (result === undefined) {
      result = func(...args)
    }
    return result;
  }
}
