import * as Applicative_ from '../../typeclasses/Applicative'
import * as ApplicativeWithIndex_ from '../../typeclasses/ApplicativeWithIndex'
import { ReadonlyArrayHkt } from './readonly-array'
import { Monad, MonadWithIndex } from './monad'

export const Applicative = Applicative_.create<ReadonlyArrayHkt>(Monad)

export const ApplicativeWithIndex = ApplicativeWithIndex_.create<
  ReadonlyArrayHkt,
  number
>(Applicative, MonadWithIndex)

export const apply: {
  <A>(
    fa: ReadonlyArray<A>,
  ): <B>(self: ReadonlyArray<(a: A, i: number) => B>) => ReadonlyArray<B>
} = ApplicativeWithIndex.applyWithIndex

export const flipApply: {
  <A, B>(
    fab: ReadonlyArray<(a: A, i: number) => B>,
  ): (self: ReadonlyArray<A>) => ReadonlyArray<B>
} = ApplicativeWithIndex.flipApplyWithIndex
