import {promises as fs} from 'fs';
import conf from 'conf';

function resolve(path: string): string {
  return `${conf.dirs.res}/${path}`;
}

async function get(path: string): Promise<string> {
  const result = await fs.readFile(resolve(path), {flag: 'r'});
  if (Buffer.isBuffer(result)) {
    return result.toString('utf-8')
  }
  return result;
}

async function put(path: string, data: string): Promise<void> {
  await fs.writeFile(resolve(path), data);
}

export default Object.freeze({get, path: resolve, put});
