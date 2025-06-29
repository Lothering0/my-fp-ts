import { ArrayHKT } from "./array"
import { Functor } from "../../types/Functor"
import { FunctorWithIndex } from "../../types/FunctorWithIndex"
import { overload } from "../../utils/overloads"

export const functor: Functor<ArrayHKT> = {
  map: overload (1, <A, B>(self: A[], ab: (a: A) => B) => self.map (a => ab (a))),
}

export const functorWithIndex: FunctorWithIndex<ArrayHKT, number> = {
  ...functor,
  mapWithIndex: overload (1, <A, B>(self: A[], iab: (i: number, a: A) => B) =>
    self.map ((a, i) => iab (i, a)),
  ),
}

export const { map, mapWithIndex } = functorWithIndex
