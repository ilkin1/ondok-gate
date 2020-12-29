// import pie from 'foundation/pie';

export async function encode(plain: string): Promise<string> {
  return '';
  // const result = await pie.call('pwd_encode', { plain });
  // return result.hash;
}

export async function check(plain: string, hash: string): Promise<boolean> {
  return true;
  // const result = await pie.call('pwd_check', { plain, hash });
  // return result.answer;
}