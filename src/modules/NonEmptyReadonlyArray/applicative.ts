import * as array from '../ReadonlyArray'
import * as applicative from '../../typeclasses/Applicative'
import * as applicativeWithIndex from '../../typeclasses/ApplicativeWithIndex'
import {
  NonEmptyReadonlyArray,
  NonEmptyReadonlyArrayHkt,
} from './non-empty-readonly-array'

export const Applicative = {
  ...array.Applicative,
} as applicative.Applicative<NonEmptyReadonlyArrayHkt>

export const ApplicativeWithIndex = {
  ...array.ApplicativeWithIndex,
} as applicativeWithIndex.ApplicativeWithIndex<NonEmptyReadonlyArrayHkt, number>

export const of: {
  <A>(a: A): NonEmptyReadonlyArray<A>
} = Applicative.of

export const ap: {
  <A>(
    fa: NonEmptyReadonlyArray<A>,
  ): <B>(
    self: NonEmptyReadonlyArray<(a: A, i: number) => B>,
  ) => NonEmptyReadonlyArray<B>
} = ApplicativeWithIndex.apWithIndex

/** Alias for `ap` */
export const apply = ap

export const flap: {
  <A, B>(
    fab: NonEmptyReadonlyArray<(a: A, i: number) => B>,
  ): (self: NonEmptyReadonlyArray<A>) => NonEmptyReadonlyArray<B>
} = ApplicativeWithIndex.flapWithIndex

/** Alias for `flap` */
export const flipApply = flap
