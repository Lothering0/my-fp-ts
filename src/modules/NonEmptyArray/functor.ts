/* eslint-disable @typescript-eslint/no-explicit-any */
import * as A from "../Array"
import { _URI } from "./non-empty-array"
import { Functor } from "../../types/Functor"
import { FunctorWithIndex } from "../../types/FunctorWithIndex"

export const functor: Functor<typeof _URI> = {
  ...A.functor,
  _URI,
} as any

export const functorWithIndex: FunctorWithIndex<typeof _URI, number> = {
  ...A.functorWithIndex,
  _URI,
} as any

export const { map, mapWithIndex } = functorWithIndex
