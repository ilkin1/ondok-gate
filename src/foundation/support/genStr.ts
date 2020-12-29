export default function genStr(length: number, space: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!.') {
  let result = '';
  const len = space.length;
  for (let i = 0; i < length; i++) {
    result += space.charAt(Math.floor(Math.random() * len));
  }
  return result;
}
