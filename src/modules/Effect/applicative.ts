import * as Result from '../Result'
import { create } from '../../typeclasses/Applicative'
import { EffectHkt, Effect, fromOperation } from './effect'
import { pipe } from '../../utils/flow'
import { Monad } from './monad'
import { flip } from '../../utils/flip'

export const Applicative = create<EffectHkt>(Monad)

export const apply: {
  <A, E1>(
    fa: Effect<A, E1>,
  ): <B, E2>(self: Effect<(a: A) => B, E2>) => Effect<B, E1 | E2>
} = Applicative.apply

export const applyConcurrently: {
  <A, E1>(
    fa: Effect<A, E1>,
  ): <B, E2>(self: Effect<(a: A) => B, E2>) => Effect<B, E1 | E2>
} = fma => self =>
  fromOperation(() => {
    const resultAb = self.run()
    const resultA = fma.run()

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
  <A, B, E1>(
    fab: Effect<(a: A) => B, E1>,
  ): <E2>(self: Effect<A, E2>) => Effect<B, E1 | E2>
} = Applicative.flipApply

export const flipApplyConcurrently: {
  <A, B, E1>(
    fab: Effect<(a: A) => B, E1>,
  ): <E2>(self: Effect<A, E2>) => Effect<B, E1 | E2>
} = flip(applyConcurrently) as typeof flipApplyConcurrently
