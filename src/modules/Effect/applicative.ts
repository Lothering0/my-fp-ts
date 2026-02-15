import * as Result from '../Result'
import { create } from '../../typeclasses/Applicative'
import { EffectHkt, Effect, fromReaderResult, run } from './effect'
import { pipe } from '../../utils/flow'
import { Monad } from './monad'
import { flip } from '../../utils/flip'

export const Applicative = create<EffectHkt>(Monad)

export const apply: {
  <A, E1, R>(
    effect: Effect<A, E1, R>,
  ): <B, E2>(selfEffect: Effect<(a: A) => B, E2, R>) => Effect<B, E1 | E2, R>
} = Applicative.apply

export const applyConcurrently: {
  <A, E1, R>(
    effect: Effect<A, E1, R>,
  ): <B, E2>(selfEffect: Effect<(a: A) => B, E2, R>) => Effect<B, E1 | E2, R>
} = effect => selfEffect =>
  fromReaderResult(r => {
    const resultAb = pipe(selfEffect, run(r))
    const resultA = pipe(effect, run(r))

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
    effect: Effect<(a: A) => B, E1, R>,
  ): <E2>(selfEffect: Effect<A, E2, R>) => Effect<B, E1 | E2, R>
} = Applicative.flipApply

export const flipApplyConcurrently: {
  <A, B, E1, R>(
    effect: Effect<(a: A) => B, E1, R>,
  ): <E2>(selfEffect: Effect<A, E2, R>) => Effect<B, E1 | E2, R>
} = flip(applyConcurrently) as typeof flipApplyConcurrently
