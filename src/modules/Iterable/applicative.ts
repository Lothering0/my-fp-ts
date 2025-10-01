import * as Applicative_ from '../../typeclasses/Applicative'
import * as ApplicativeWithIndex_ from '../../typeclasses/ApplicativeWithIndex'
import { Monad, MonadWithIndex } from './monad'
import { IterableHkt } from './iterable'

export const Applicative = Applicative_.create<IterableHkt>(Monad)

export const ApplicativeWithIndex = ApplicativeWithIndex_.create<
  IterableHkt,
  number
>(Applicative, MonadWithIndex)

export const apply: {
  <A>(
    fa: Iterable<A>,
  ): <B>(self: Iterable<(a: A, i: number) => B>) => Iterable<B>
} = ApplicativeWithIndex.applyWithIndex

export const flipApply: {
  <A, B>(
    fab: Iterable<(a: A, i: number) => B>,
  ): (self: Iterable<A>) => Iterable<B>
} = ApplicativeWithIndex.flipApplyWithIndex
