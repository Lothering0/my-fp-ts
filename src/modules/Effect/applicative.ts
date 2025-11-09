import * as Result from '../Result'
import { create } from '../../typeclasses/Applicative'
import { EffectHkt, Effect, fromReader, run } from './effect'
import { pipe } from '../../utils/flow'
import { Monad } from './monad'
import { flip } from '../../utils/flip'

export const Applicative = create<EffectHkt>(Monad)

export const apply: {
  <A, E1, R>(
    fa: Effect<A, E1, R>,
  ): <B, E2>(self: Effect<(a: A) => B, E2, R>) => Effect<B, E1 | E2, R>
} = Applicative.apply

export const applyConcurrently: {
  <A, E1, R>(
    fa: Effect<A, E1, R>,
  ): <B, E2>(self: Effect<(a: A) => B, E2, R>) => Effect<B, E1 | E2, R>
} = fma => self =>
  fromReader(r => {
    const resultAb = pipe(self, run(r))
    const resultA = pipe(fma, run(r))

    if (!(resultAb instanceof Promise) && Result.isFailure(resultAb)) {
      return resultAb
    }

    if (!(resultA instanceof Promise) && Result.isFailure(resultA)) {
      return resultA
    }

    if (resultAb instanceof Promise || resultA instanceof Promise) {
      return Promise.all([resultAb, resultA]).then(([mab, ma]) =>
        pipe(mab, Result.apply(ma)),
      )
    }

    return pipe(resultAb, Result.apply(resultA))
  })

export const flipApply: {
  <A, B, E1, R>(
    fab: Effect<(a: A) => B, E1, R>,
  ): <E2>(self: Effect<A, E2, R>) => Effect<B, E1 | E2, R>
} = Applicative.flipApply

export const flipApplyConcurrently: {
  <A, B, E1, R>(
    fab: Effect<(a: A) => B, E1, R>,
  ): <E2>(self: Effect<A, E2, R>) => Effect<B, E1 | E2, R>
} = flip(applyConcurrently) as typeof flipApplyConcurrently
