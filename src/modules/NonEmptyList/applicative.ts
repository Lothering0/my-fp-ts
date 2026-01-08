import * as List from '../List'
import * as Applicative_ from '../../typeclasses/Applicative'
import * as ApplicativeWithIndex_ from '../../typeclasses/ApplicativeWithIndex'
import { NonEmptyList, NonEmptyListHkt } from './non-empty-list'

export const Applicative = {
  ...List.Applicative,
} as Applicative_.Applicative<NonEmptyListHkt>

export const ApplicativeWithIndex = {
  ...List.ApplicativeWithIndex,
} as ApplicativeWithIndex_.ApplicativeWithIndex<NonEmptyListHkt, number>

export const apply: {
  <A>(
    fa: NonEmptyList<A>,
  ): <B>(list: NonEmptyList<(a: A, i: number) => B>) => NonEmptyList<B>
} = ApplicativeWithIndex.applyWithIndex

export const flipApply: {
  <A, B>(
    fab: NonEmptyList<(a: A, i: number) => B>,
  ): (list: NonEmptyList<A>) => NonEmptyList<B>
} = ApplicativeWithIndex.flipApplyWithIndex
