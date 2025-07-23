import * as F from "../../types/Functor"
import * as FI from "../../types/FunctorWithIndex"
import { ReadonlyArrayHKT } from "./readonly-array"
import { overload } from "../../utils/overloads"

export const Functor: F.Functor<ReadonlyArrayHKT> = {
  map: overload (1, <A, B>(self: ReadonlyArray<A>, ab: (a: A) => B) =>
    self.map (a => ab (a)),
  ),
}

export const FunctorWithIndex: FI.FunctorWithIndex<ReadonlyArrayHKT, number> = {
  ...Functor,
  mapWithIndex: overload (
    1,
    <A, B>(self: ReadonlyArray<A>, iab: (i: number, a: A) => B) =>
      self.map ((a, i) => iab (i, a)),
  ),
}

export const map: {
  <A, B>(ab: (a: A) => B): (self: ReadonlyArray<A>) => ReadonlyArray<B>
  <A, B>(self: ReadonlyArray<A>, ab: (a: A) => B): ReadonlyArray<B>
} = Functor.map

export const mapWithIndex: {
  <A, B>(
    iab: (i: number, a: A) => B,
  ): (self: ReadonlyArray<A>) => ReadonlyArray<B>
  <A, B>(self: ReadonlyArray<A>, iab: (i: number, a: A) => B): ReadonlyArray<B>
} = FunctorWithIndex.mapWithIndex
