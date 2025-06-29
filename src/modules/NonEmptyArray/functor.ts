import * as A from "../Array"
import { NonEmptyArrayHKT } from "./non-empty-array"
import { Functor } from "../../types/Functor"
import { FunctorWithIndex } from "../../types/FunctorWithIndex"

export const functor: Functor<NonEmptyArrayHKT> = {
  ...A.functor,
} as Functor<NonEmptyArrayHKT>

export const functorWithIndex: FunctorWithIndex<NonEmptyArrayHKT, number> = {
  ...A.functorWithIndex,
} as FunctorWithIndex<NonEmptyArrayHKT, number>

export const { map, mapWithIndex } = functorWithIndex
