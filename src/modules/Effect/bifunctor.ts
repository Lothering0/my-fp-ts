import * as Result from '../Result'
import { create } from '../../typeclasses/Bifunctor'
import { Functor, mapResult } from './functor'
import { Effect, EffectHkt } from './effect'

export const Bifunctor = create<EffectHkt>(Functor, {
  mapLeft: ed => mapResult(Result.mapLeft(ed)),
})

export const mapLeft: {
  <E1, E2>(ed: (failure: E1) => E2): <A>(self: Effect<A, E1>) => Effect<A, E2>
} = Bifunctor.mapLeft

export const bimap: {
  <E1, E2, A, B>(
    ed: (failure: E1) => E2,
    ab: (success: A) => B,
  ): (self: Effect<A, E1>) => Effect<B, E2>
} = Bifunctor.bimap
