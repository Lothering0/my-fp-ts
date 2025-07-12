import { HKT, Kind } from "./HKT"

export type Prettify<A> = {
  [K in keyof A]: A[K]
} & {}

export interface LazyArg<A> {
  (): A
}

export interface NaturalTransformation<F extends HKT, G extends HKT> {
  <R, E, A>(fa: Kind<F, R, E, A>): Kind<G, R, E, A>
}

export interface Refinement<A, B extends A> {
  (a: A): a is B
}
