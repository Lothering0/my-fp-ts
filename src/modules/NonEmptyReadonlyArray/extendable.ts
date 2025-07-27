import * as readonlyArray from "../ReadonlyArray"
import * as extendable from "../../types/Extendable"
import {
  NonEmptyReadonlyArray,
  NonEmptyReadonlyArrayHKT,
} from "./non-empty-readonly-array"

export const Extendable = {
  ...readonlyArray.Extendable,
} as extendable.Extendable<NonEmptyReadonlyArrayHKT>

export const extend: {
  <A, B>(
    fab: (fa: NonEmptyReadonlyArray<A>) => B,
  ): (self: NonEmptyReadonlyArray<A>) => NonEmptyReadonlyArray<B>
} = Extendable.extend

export const duplicate: {
  <A>(
    self: NonEmptyReadonlyArray<A>,
  ): NonEmptyReadonlyArray<NonEmptyReadonlyArray<A>>
} = Extendable.duplicate
