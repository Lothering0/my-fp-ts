import { Hkt } from '../../typeclasses/Hkt'
import { NonEmptyReadonlyArray } from '../NonEmptyReadonlyArray'

export interface ReadonlyArrayHkt extends Hkt {
  readonly Type: ReadonlyArray<this['In']>
}

export type Infer<F extends ReadonlyArray<any>> =
  F extends ReadonlyArray<infer A> ? A : never

export type With<F extends ReadonlyArray<any>, A = Infer<F>> =
  F extends NonEmptyReadonlyArray<any>
    ? NonEmptyReadonlyArray<A>
    : ReadonlyArray<A>

export type OrNonEmpty<
  F extends ReadonlyArray<any>,
  G extends ReadonlyArray<any>,
  A = Infer<F> | Infer<G>,
> =
  F extends NonEmptyReadonlyArray<any>
    ? NonEmptyReadonlyArray<A>
    : G extends NonEmptyReadonlyArray<any>
      ? NonEmptyReadonlyArray<A>
      : ReadonlyArray<A>

export type AndNonEmpty<
  F extends ReadonlyArray<any>,
  G extends ReadonlyArray<any>,
  A = Infer<F> | Infer<G>,
> =
  F extends NonEmptyReadonlyArray<any>
    ? G extends NonEmptyReadonlyArray<any>
      ? NonEmptyReadonlyArray<A>
      : ReadonlyArray<A>
    : ReadonlyArray<A>

const ArrayConstructor = Array

export { ArrayConstructor as Array }
