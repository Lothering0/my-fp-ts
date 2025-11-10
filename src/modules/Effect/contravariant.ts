import * as Contravariant_ from '../../typeclasses/Contravariant'
import { Effect, EffectHkt } from './effect'
import { local } from './utils'

export const Contravariant: Contravariant_.Contravariant<EffectHkt> = {
  contramap: local,
}

export const contramap: {
  <S, R>(sr: (s: S) => R): <A, E>(self: Effect<A, E, R>) => Effect<A, E, S>
} = Contravariant.contramap
