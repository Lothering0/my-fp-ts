import * as F from "../../types/Functor"
import { SeparatedHKT, Separated, left, right } from "./separated"
import { createBifunctor } from "../../types/Bifunctor"
import { make } from "./utils"
import { pipe } from "../../utils/flow"
import { overload } from "../../utils/overloads"

export const Functor: F.Functor<SeparatedHKT> = {
  map: overload (1, <_, A, B>(self: Separated<_, A>, ab: (a: A) => B) =>
    make (left (self), pipe (self, right, ab)),
  ),
}

export const Bifunctor = createBifunctor<SeparatedHKT> ({
  ...Functor,
  mapLeft: overload (1, <E, _, D>(self: Separated<E, _>, ed: (e: E) => D) =>
    make (pipe (self, left, ed), right (self)),
  ),
})

export const map: {
  <_, A, B>(ab: (a: A) => B): (self: Separated<_, A>) => Separated<_, B>
  <_, A, B>(self: Separated<_, A>, ab: (a: A) => B): Separated<_, B>
} = Functor.map

export const mapLeft: {
  <E, _, D>(ed: (e: E) => D): (self: Separated<E, _>) => Separated<D, _>
  <E, _, D>(self: Separated<E, _>, ed: (e: E) => D): Separated<D, _>
} = Bifunctor.mapLeft

export const bimap: {
  <E, A, D, B>(
    ed: (e: E) => D,
    ab: (a: A) => B,
  ): (self: Separated<E, A>) => Separated<D, B>
  <E, A, D, B>(
    self: Separated<E, A>,
    ed: (e: E) => D,
    ab: (a: A) => B,
  ): Separated<D, B>
} = Bifunctor.bimap
