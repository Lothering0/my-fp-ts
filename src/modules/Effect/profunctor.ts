import * as Profunctor_ from '../../typeclasses/Profunctor'
import { Contravariant } from './contravariant'
import { Functor } from './functor'
import { Effect, EffectHkt } from './effect'

export const Profunctor = Profunctor_.create<EffectHkt>(Functor, Contravariant)

export const promap: {
  <A, B, R1, R2>(
    de: (r2: R2) => R1,
    ab: (a: A) => B,
  ): <E>(self: Effect<A, E, R1>) => Effect<B, E, R2>
} = Profunctor.promap
