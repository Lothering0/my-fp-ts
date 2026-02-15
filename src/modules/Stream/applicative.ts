import * as Stream from './stream'
import * as Applicative_ from '../../typeclasses/Applicative'
import * as ApplicativeWithIndex_ from '../../typeclasses/ApplicativeWithIndex'
import { Monad, MonadWithIndex } from './monad'

export const Applicative = Applicative_.create<Stream.Hkt>(Monad)

export const ApplicativeWithIndex = ApplicativeWithIndex_.create<
  Stream.Hkt,
  number
>(Applicative, MonadWithIndex)

export const apply: {
  <A, E1, R>(
    fa: Stream.Stream<A, E1, R>,
  ): <B, E2>(
    stream: Stream.Stream<(a: A, i: number) => B, E2, R>,
  ) => Stream.Stream<B, E1 | E2, R>
} = ApplicativeWithIndex.applyWithIndex

export const flipApply: {
  <A, B, E1, R>(
    fab: Stream.Stream<(a: A, i: number) => B, E1, R>,
  ): <E2>(self: Stream.Stream<A, E2, R>) => Stream.Stream<B, E1 | E2, R>
} = ApplicativeWithIndex.flipApplyWithIndex
