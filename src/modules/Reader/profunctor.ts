import * as profunctor from "../../typeclasses/Profunctor"
import { flow } from "../../utils/flow"
import { Functor } from "./functor"
import { Reader, ReaderCollectableHkt } from "./reader"

export const Profunctor: profunctor.Profunctor<ReaderCollectableHkt> = {
  ...Functor,
  promap: (de, ab) => self => flow (de, self, ab),
}

export const promap: {
  <Collectable1, Collectable2, In, Out>(
    de: (r1: Collectable2) => Collectable1,
    ab: (a: In) => Out,
  ): (self: Reader<Collectable1, In>) => Reader<Collectable2, Out>
} = Profunctor.promap
