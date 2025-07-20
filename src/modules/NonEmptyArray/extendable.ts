import * as A from "../Array"
import * as E from "../../types/Extendable"
import { NonEmptyArray, NonEmptyArrayHKT } from "./non-empty-array"

export const Extendable = {
  ...A.Extendable,
} as E.Extendable<NonEmptyArrayHKT>

export const extend: {
  <A, B>(
    fab: (fa: NonEmptyArray<A>) => B,
  ): (self: NonEmptyArray<A>) => NonEmptyArray<B>
  <A, B>(
    self: NonEmptyArray<A>,
    fab: (fa: NonEmptyArray<A>) => B,
  ): NonEmptyArray<B>
} = Extendable.extend

export const duplicate: {
  <A>(self: NonEmptyArray<A>): NonEmptyArray<NonEmptyArray<A>>
} = Extendable.duplicate
