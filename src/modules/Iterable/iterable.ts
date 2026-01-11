import { Hkt } from '../../typeclasses/Hkt'

export interface IterableHkt extends Hkt {
  readonly Type: Iterable<this['In']>
}

export interface NonEmpty<A> extends Iterable<A> {
  readonly 0: A
}

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
