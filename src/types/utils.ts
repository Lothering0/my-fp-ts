import { Hkt, Kind } from "./Hkt"

export type Prettify<A> = {
  [K in keyof A]: A[K]
} & {}

export interface LazyArg<A> {
  (): A
}

export interface NaturalTransformation<F extends Hkt, G extends Hkt> {
  <S, E, A>(fa: Kind<F, S, E, A>): Kind<G, S, E, A>
}

export interface Refinement<A, B extends A> {
  (a: A): a is B
}
