import { Hkt as Hkt_ } from '../../typeclasses/Hkt'
import { NonEmptyIterable } from '../_internal'
import { NonEmpty as NonEmptyArray } from '../ReadonlyArray'

export interface Hkt extends Hkt_ {
  readonly Type: Iterable<this['In']>
}

export interface NonEmptyHkt extends Hkt_ {
  readonly Type: NonEmpty<this['In']>
}

export type NonEmpty<A> = NonEmptyArray<A> | NonEmptyIterable<A>

export type Infer<F extends Iterable<any>> =
  F extends Iterable<infer A> ? A : never

export type With<F extends Iterable<any>, A = Infer<F>> =
  F extends NonEmpty<any> ? NonEmpty<A> : Iterable<A>

export type OrNonEmpty<
  F extends Iterable<any>,
  G extends Iterable<any>,
  A = Infer<F> | Infer<G>,
> =
  F extends NonEmpty<any>
    ? NonEmpty<A>
    : G extends NonEmpty<any>
      ? NonEmpty<A>
      : Iterable<A>

export type AndNonEmpty<
  F extends Iterable<any>,
  G extends Iterable<any>,
  A = Infer<F> | Infer<G>,
> =
  F extends NonEmpty<any>
    ? G extends NonEmpty<any>
      ? NonEmpty<A>
      : Iterable<A>
    : Iterable<A>
