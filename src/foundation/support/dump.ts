
type MakeDumperOptions<T> = {
  handle: (collection: T[]) => Promise<void>,
  period: number
}
type Dumper<T> = (data: T) => void;
export default function makeDump<T = any>({
  handle,
  period
}: MakeDumperOptions<T>): Dumper<T> {
  const garbage: T[] = [];

  setInterval(function() {
    if (garbage.length > 0) {
      handle([...garbage]).then(() => {
        garbage.length = 0;
      }).catch(err => {
        console.error(err);
      });
    }
  }, period);

  return data => {
    garbage.push(data);
  }
}