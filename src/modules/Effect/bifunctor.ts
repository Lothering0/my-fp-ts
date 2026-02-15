import * as Result from '../Result'
import { create } from '../../typeclasses/Bifunctor'
import { Functor, mapResult } from './functor'
import { Effect, EffectHkt } from './effect'
import { pipe } from '../../utils/flow'

export const Bifunctor = create<EffectHkt>(Functor, {
  mapLeft: ed => mapResult(result => () => pipe(result, Result.mapLeft(ed))),
})

export const mapLeft: {
  <E1, E2>(
    ed: (failure: E1) => E2,
  ): <A, R>(effect: Effect<A, E1, R>) => Effect<A, E2, R>
} = Bifunctor.mapLeft

export const bimap: {
  <E1, E2, A, B>(
    ed: (failure: E1) => E2,
    ab: (success: A) => B,
  ): <R>(effect: Effect<A, E1, R>) => Effect<B, E2, R>
} = Bifunctor.bimap
