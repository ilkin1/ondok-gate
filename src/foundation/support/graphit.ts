import {set, lensPath} from "ramda";

export default function graphit(sep: string = ':') {
  let map;
  return function (list: Obj[]): Obj[] {
    if (list.length === 0) return list;
    if (map === undefined) {
      map = Object.keys(list[0]).map(prop => ([prop, set(lensPath(prop.split(sep)))]));
    }
    return list.map((row) => map.reduce((val, [prop, lens]) => lens(row[prop], val), {}));
  };
}
