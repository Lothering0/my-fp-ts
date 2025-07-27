import * as readonlyArray from "../ReadonlyArray"
import * as functor from "../../types/Functor"
import * as functorWithIndex from "../../types/FunctorWithIndex"
import {
  NonEmptyReadonlyArray,
  NonEmptyReadonlyArrayHKT,
} from "./non-empty-readonly-array"

export const Functor = {
  ...readonlyArray.Functor,
} as functor.Functor<NonEmptyReadonlyArrayHKT>

export const FunctorWithIndex = {
  ...readonlyArray.FunctorWithIndex,
} as functorWithIndex.FunctorWithIndex<NonEmptyReadonlyArrayHKT, number>

export const map: {
  <A, B>(
    ab: (a: A) => B,
  ): (self: NonEmptyReadonlyArray<A>) => NonEmptyReadonlyArray<B>
} = Functor.map

export const mapWithIndex: {
  <A, B>(
    iab: (i: number, a: A) => B,
  ): (self: NonEmptyReadonlyArray<A>) => NonEmptyReadonlyArray<B>
} = FunctorWithIndex.mapWithIndex
