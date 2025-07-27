import * as functor from "../../types/Functor"
import * as functorWithIndex from "../../types/FunctorWithIndex"
import { ReadonlyArrayHKT } from "./readonly-array"

export const Functor: functor.Functor<ReadonlyArrayHKT> = {
  map: ab => self => self.map (a => ab (a)),
}

export const FunctorWithIndex: functorWithIndex.FunctorWithIndex<
  ReadonlyArrayHKT,
  number
> = {
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
