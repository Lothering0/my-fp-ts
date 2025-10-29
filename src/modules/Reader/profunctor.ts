import * as Profunctor_ from '../../typeclasses/Profunctor'
import { Contravariant } from './contravariant'
import { Functor } from './functor'
import { Reader, ReaderHkt } from './reader'

export const Profunctor = Profunctor_.create<ReaderHkt>(Functor, Contravariant)

export const promap: {
  <R1, R2, A, B>(
    de: (r2: R2) => R1,
    ab: (a: A) => B,
  ): (self: Reader<R1, A>) => Reader<R2, B>
} = Profunctor.promap
