export type Prettify<A> = {
  [K in keyof A]: A[K]
} & {}
