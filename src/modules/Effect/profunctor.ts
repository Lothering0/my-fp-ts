import * as Profunctor_ from '../../typeclasses/Profunctor'
import { Contravariant } from './contravariant'
import { Functor } from './functor'
import { Effect, Hkt } from './effect'

export const Profunctor = Profunctor_.create<Hkt>(Functor, Contravariant)

export const promap: {
  <A, B, R1, R2>(
    de: (r2: R2) => R1,
    ab: (a: A) => B,
  ): <E>(effect: Effect<A, E, R1>) => Effect<B, E, R2>
} = Profunctor.promap
