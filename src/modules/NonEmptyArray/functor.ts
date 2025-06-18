/* eslint-disable @typescript-eslint/no-explicit-any */
import * as A from "../Array"
import { URI } from "./non-empty-array"
import { Functor } from "../../types/Functor"
import { FunctorWithIndex } from "../../types/FunctorWithIndex"

export const functor: Functor<URI> = {
  ...A.functor,
  URI,
} as any

export const functorWithIndex: FunctorWithIndex<URI, number> = {
  ...A.functorWithIndex,
  URI,
} as any

export const { map, mapWithIndex } = functorWithIndex
