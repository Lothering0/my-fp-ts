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

export const apply: {
  <A>(
    fa: NonEmptyReadonlyArray<A>,
  ): <B>(
    self: NonEmptyReadonlyArray<(a: A, i: number) => B>,
  ) => NonEmptyReadonlyArray<B>
} = ApplicativeWithIndex.applyWithIndex

export const flipApply: {
  <A, B>(
    fab: NonEmptyReadonlyArray<(a: A, i: number) => B>,
  ): (self: NonEmptyReadonlyArray<A>) => NonEmptyReadonlyArray<B>
} = ApplicativeWithIndex.flipApplyWithIndex
