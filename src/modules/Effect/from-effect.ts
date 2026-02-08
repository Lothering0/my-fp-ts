import * as Effect from '../Effect'
import { FromEffect as FromEffect_ } from '../../typeclasses/FromEffect'
import { identity } from '../Identity'

export const FromEffect: FromEffect_<Effect.EffectHkt> = {
  fromEffect: identity,
}

export const fromEffect: {
  <A, E = never, R = never>(
    effect: Effect.Effect<A, E, R>,
  ): Effect.Effect<A, E, R>
} = FromEffect.fromEffect
