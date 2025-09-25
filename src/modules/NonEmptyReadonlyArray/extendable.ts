import * as array from "../ReadonlyArray"
import * as extendable from "../../typeclasses/Extendable"
import {
  NonEmptyReadonlyArray,
  NonEmptyReadonlyArrayHkt,
} from "./non-empty-readonly-array"

export const Extendable = {
  ...array.Extendable,
} as extendable.Extendable<NonEmptyReadonlyArrayHkt>

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
