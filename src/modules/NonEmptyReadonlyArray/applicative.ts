import * as Array from '../ReadonlyArray'
import * as Applicative_ from '../../typeclasses/Applicative'
import * as ApplicativeWithIndex_ from '../../typeclasses/ApplicativeWithIndex'
import {
  NonEmptyReadonlyArray,
  NonEmptyReadonlyArrayHkt,
} from './non-empty-readonly-array'

export const Applicative = {
  ...Array.Applicative,
} as Applicative_.Applicative<NonEmptyReadonlyArrayHkt>

export const ApplicativeWithIndex = {
  ...Array.ApplicativeWithIndex,
} as ApplicativeWithIndex_.ApplicativeWithIndex<
  NonEmptyReadonlyArrayHkt,
  number
>

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
