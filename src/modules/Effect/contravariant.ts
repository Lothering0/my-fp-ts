import * as Contravariant_ from '../../typeclasses/Contravariant'
import { Effect, Hkt } from './effect'
import { local } from './utils'

export const Contravariant: Contravariant_.Contravariant<Hkt> = {
  contramap: local,
}

export const contramap: {
  <S, R>(sr: (s: S) => R): <A, E>(effect: Effect<A, E, R>) => Effect<A, E, S>
} = Contravariant.contramap
