import * as Chunk from './chunk'
import * as Applicative_ from '../../typeclasses/Applicative'
import * as ApplicativeWithIndex_ from '../../typeclasses/ApplicativeWithIndex'
import {
  Monad,
  MonadWithIndex,
  NonEmptyMonad,
  NonEmptyMonadWithIndex,
} from './monad'

export const Applicative = Applicative_.create<Chunk.Hkt>(Monad)

export const NonEmptyApplicative =
  Applicative_.create<Chunk.NonEmptyHkt>(NonEmptyMonad)

export const ApplicativeWithIndex = ApplicativeWithIndex_.create<
  Chunk.Hkt,
  number
>(Applicative, MonadWithIndex)

export const NonEmptyApplicativeWithIndex = ApplicativeWithIndex_.create<
  Chunk.NonEmptyHkt,
  number
>(NonEmptyApplicative, NonEmptyMonadWithIndex)

export const apply: {
  <F extends Chunk.Chunk<any>>(
    chunk: F,
  ): <G extends Chunk.Chunk<(a: Chunk.Infer<F>, i: number) => any>>(
    selfChunk: G,
  ) => Chunk.AndNonEmpty<F, G, ReturnType<Chunk.Infer<G>>>
} = ApplicativeWithIndex.applyWithIndex as any

export const flipApply: {
  <
    F extends Chunk.Chunk<any>,
    G extends Chunk.Chunk<(a: Chunk.Infer<F>, i: number) => any>,
  >(
    chunk: G,
  ): (selfChunk: F) => Chunk.AndNonEmpty<F, G, ReturnType<Chunk.Infer<G>>>
} = ApplicativeWithIndex.flipApplyWithIndex as any
