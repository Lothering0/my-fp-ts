import { Hkt as Hkt_ } from '../../typeclasses/Hkt'

export interface Hkt extends Hkt_ {
  readonly Type: ReadonlyArray<this['In']>
}

export interface NonEmptyHkt extends Hkt_ {
  readonly Type: NonEmpty<this['In']>
}

export type NonEmpty<A> = readonly [A, ...ReadonlyArray<A>]

export type Infer<F extends ReadonlyArray<any>> =
  F extends ReadonlyArray<infer A> ? A : never

export type With<F extends ReadonlyArray<any>, A = Infer<F>> =
  F extends NonEmpty<any> ? NonEmpty<A> : ReadonlyArray<A>

export type OrNonEmpty<
  F extends ReadonlyArray<any>,
  G extends ReadonlyArray<any>,
  A = Infer<F> | Infer<G>,
> =
  F extends NonEmpty<any>
    ? NonEmpty<A>
    : G extends NonEmpty<any>
      ? NonEmpty<A>
      : ReadonlyArray<A>

export type AndNonEmpty<
  F extends ReadonlyArray<any>,
  G extends ReadonlyArray<any>,
  A = Infer<F> | Infer<G>,
> =
  F extends NonEmpty<any>
    ? G extends NonEmpty<any>
      ? NonEmpty<A>
      : ReadonlyArray<A>
    : ReadonlyArray<A>

const ArrayConstructor = Array

export { ArrayConstructor as Array }
