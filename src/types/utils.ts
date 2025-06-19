export type Prettify<A> = {
  [K in keyof A]: A[K]
} & {}

export type LazyArg<A> = {
  (): A
}
