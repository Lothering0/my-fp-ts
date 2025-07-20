import * as A from "../Array"
import * as F from "../../types/Functor"
import * as FI from "../../types/FunctorWithIndex"
import { NonEmptyArray, NonEmptyArrayHKT } from "./non-empty-array"

export const Functor = {
  ...A.Functor,
} as F.Functor<NonEmptyArrayHKT>

export const FunctorWithIndex = {
  ...A.FunctorWithIndex,
} as FI.FunctorWithIndex<NonEmptyArrayHKT, number>

export const map: {
  <A, B>(ab: (a: A) => B): (self: NonEmptyArray<A>) => NonEmptyArray<B>
  <A, B>(self: NonEmptyArray<A>, ab: (a: A) => B): NonEmptyArray<B>
} = Functor.map

export const mapWithIndex: {
  <A, B>(
    iab: (i: number, a: A) => B,
  ): (self: NonEmptyArray<A>) => NonEmptyArray<B>
  <A, B>(self: NonEmptyArray<A>, iab: (i: number, a: A) => B): NonEmptyArray<B>
} = FunctorWithIndex.mapWithIndex
