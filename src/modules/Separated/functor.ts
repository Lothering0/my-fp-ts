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

export const { map, mapLeft, bimap } = Bifunctor
