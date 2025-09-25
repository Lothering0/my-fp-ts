import * as profunctor from "../../typeclasses/Profunctor"
import { flow } from "../../utils/flow"
import { Functor } from "./functor"
import { Reader, ReaderCollectableHkt } from "./reader"

export const Profunctor: profunctor.Profunctor<ReaderCollectableHkt> = {
  ...Functor,
  promap: (de, ab) => self => flow (de, self, ab),
}

export const promap: {
  <R1, R2, A, B>(
    de: (r1: R2) => R1,
    ab: (a: A) => B,
  ): (self: Reader<R1, A>) => Reader<R2, B>
} = Profunctor.promap
