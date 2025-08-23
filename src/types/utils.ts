import { Hkt, Kind } from "./Hkt"

export type Prettify<In> = {
  [K in keyof In]: In[K]
} & {}

export interface LazyArg<Out> {
  (): Out
}

export interface NaturalTransformation<F extends Hkt, G extends Hkt> {
  <In, Collectable, Fixed>(
    fa: Kind<F, In, Collectable, Fixed>,
  ): Kind<G, In, Collectable, Fixed>
}

export interface Refinement<In, Out extends In> {
  (a: In): a is Out
}

export interface RefinementWithIndex<In, Out extends In, Index> {
  (a: In, i: Index): a is Out
}

export type TheseOrAnyString<Out extends string> = Out | (string & {})

export type TheseOrAnyNumber<Out extends number> = Out | (number & {})
