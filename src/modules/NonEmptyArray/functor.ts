import * as A from "../Array"
import * as F from "../../types/Functor"
import * as FI from "../../types/FunctorWithIndex"
import { NonEmptyArrayHKT } from "./non-empty-array"

export const Functor = {
  ...A.Functor,
} as F.Functor<NonEmptyArrayHKT>

export const FunctorWithIndex = {
  ...A.FunctorWithIndex,
} as FI.FunctorWithIndex<NonEmptyArrayHKT, number>

export const { map, mapWithIndex } = FunctorWithIndex
