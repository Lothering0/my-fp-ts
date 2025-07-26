import * as F from "../../types/Functor"
import * as FI from "../../types/FunctorWithIndex"
import { ReadonlyArrayHKT } from "./readonly-array"

export const Functor: F.Functor<ReadonlyArrayHKT> = {
  map: ab => self => self.map (a => ab (a)),
}

export const FunctorWithIndex: FI.FunctorWithIndex<ReadonlyArrayHKT, number> = {
  ...Functor,
  mapWithIndex: iab => self => self.map ((a, i) => iab (i, a)),
}

export const map: {
  <A, B>(ab: (a: A) => B): (self: ReadonlyArray<A>) => ReadonlyArray<B>
} = Functor.map

export const mapWithIndex: {
  <A, B>(
    iab: (i: number, a: A) => B,
  ): (self: ReadonlyArray<A>) => ReadonlyArray<B>
} = FunctorWithIndex.mapWithIndex
