import * as F from "../../types/Functor"
import * as FI from "../../types/FunctorWithIndex"
import { ArrayHKT } from "./array"
import { overload } from "../../utils/overloads"

export const Functor: F.Functor<ArrayHKT> = {
  map: overload (1, <A, B>(self: A[], ab: (a: A) => B) => self.map (a => ab (a))),
}

export const FunctorWithIndex: FI.FunctorWithIndex<ArrayHKT, number> = {
  ...Functor,
  mapWithIndex: overload (1, <A, B>(self: A[], iab: (i: number, a: A) => B) =>
    self.map ((a, i) => iab (i, a)),
  ),
}

export const map: {
  <A, B>(ab: (a: A) => B): (self: A[]) => B[]
  <A, B>(self: A[], ab: (a: A) => B): B[]
} = Functor.map

export const mapWithIndex: {
  <A, B>(iab: (i: number, a: A) => B): (self: A[]) => B[]
  <A, B>(self: A[], iab: (i: number, a: A) => B): B[]
} = FunctorWithIndex.mapWithIndex
