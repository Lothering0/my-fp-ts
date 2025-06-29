import { SeparatedHKT, Separated, left, right } from "./separated"
import { Functor } from "../../types/Functor"
import { Bifunctor, createBifunctor } from "../../types/Bifunctor"
import { make } from "./utils"
import { pipe } from "../../utils/flow"
import { overload } from "../../utils/overloads"

export const functor: Functor<SeparatedHKT> = {
  map: overload (1, <_, A, B>(self: Separated<_, A>, ab: (a: A) => B) =>
    make (left (self), pipe (self, right, ab)),
  ),
}

export const bifunctor: Bifunctor<SeparatedHKT> = createBifunctor ({
  ...functor,
  mapLeft: overload (1, <E, _, D>(self: Separated<E, _>, ed: (e: E) => D) =>
    make (pipe (self, left, ed), right (self)),
  ),
})

export const { map, mapLeft, bimap } = bifunctor
