import * as RA from "../ReadonlyArray"
import * as F from "../../types/Functor"
import * as FI from "../../types/FunctorWithIndex"
import {
  NonEmptyReadonlyArray,
  NonEmptyReadonlyArrayHKT,
} from "./non-empty-readonly-array"

export const Functor = {
  ...RA.Functor,
} as F.Functor<NonEmptyReadonlyArrayHKT>

export const FunctorWithIndex = {
  ...RA.FunctorWithIndex,
} as FI.FunctorWithIndex<NonEmptyReadonlyArrayHKT, number>

export const map: {
  <A, B>(
    ab: (a: A) => B,
  ): (self: NonEmptyReadonlyArray<A>) => NonEmptyReadonlyArray<B>
  <A, B>(
    self: NonEmptyReadonlyArray<A>,
    ab: (a: A) => B,
  ): NonEmptyReadonlyArray<B>
} = Functor.map

export const mapWithIndex: {
  <A, B>(
    iab: (i: number, a: A) => B,
  ): (self: NonEmptyReadonlyArray<A>) => NonEmptyReadonlyArray<B>
  <A, B>(
    self: NonEmptyReadonlyArray<A>,
    iab: (i: number, a: A) => B,
  ): NonEmptyReadonlyArray<B>
} = FunctorWithIndex.mapWithIndex
