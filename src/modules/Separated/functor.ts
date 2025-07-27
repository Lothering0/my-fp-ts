import * as functor from "../../types/Functor"
import { SeparatedHKT, Separated, left, right } from "./separated"
import { createBifunctor } from "../../types/Bifunctor"
import { make } from "./utils"
import { pipe } from "../../utils/flow"

export const Functor: functor.Functor<SeparatedHKT> = {
  map: ab => self => make (left (self), pipe (self, right, ab)),
}

export const Bifunctor = createBifunctor<SeparatedHKT> ({
  ...Functor,
  mapLeft: ed => self => make (pipe (self, left, ed), right (self)),
})

export const map: {
  <A, B>(ab: (a: A) => B): <_>(self: Separated<_, A>) => Separated<_, B>
} = Functor.map

export const mapLeft: {
  <E, D>(ed: (e: E) => D): <_>(self: Separated<E, _>) => Separated<D, _>
} = Bifunctor.mapLeft

export const bimap: {
  <E, A, D, B>(
    ed: (e: E) => D,
    ab: (a: A) => B,
  ): (self: Separated<E, A>) => Separated<D, B>
} = Bifunctor.bimap
