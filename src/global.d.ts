declare type HttpRoute = AppRoute

declare type WithRequired<T, U> = Required<Pick<T, U>> & Omit<T, U>

declare type OneOfRequired<T, A, B> = WithRequired<T, A> | WithRequired<T, B>

declare type Obj<T = any> = {
  [x: string]: T
}
