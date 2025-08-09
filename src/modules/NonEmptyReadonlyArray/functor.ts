import * as readonlyArray from "../ReadonlyArray"
import * as functor from "../../types/Functor"
import * as functorWithIndex from "../../types/FunctorWithIndex"
import {
  NonEmptyReadonlyArray,
  NonEmptyReadonlyArrayHkt,
} from "./non-empty-readonly-array"

export const Functor = {
  ...readonlyArray.Functor,
} as functor.Functor<NonEmptyReadonlyArrayHkt>

export const FunctorWithIndex = {
  ...readonlyArray.FunctorWithIndex,
} as functorWithIndex.FunctorWithIndex<NonEmptyReadonlyArrayHkt, number>

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
