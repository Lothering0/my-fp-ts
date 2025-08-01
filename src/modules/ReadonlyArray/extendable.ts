import { createExtendable } from "../../types/Extendable"
import { ReadonlyArrayHKT } from "./readonly-array"
import { Functor } from "./functor"
import { fromNonEmpty, matchLeft, prepend } from "./utils"
import { constEmptyArray } from "../../utils/constant"
import { pipe } from "../../utils/flow"

export const Extendable = createExtendable<ReadonlyArrayHKT> ({
  ...Functor,
  extend: fab =>
    matchLeft (constEmptyArray, (head, tail) =>
      pipe (
        tail,
        extend (fab),
        pipe (prepend (head) (tail), fab, prepend),
        fromNonEmpty,
      ),
    ),
})

export const extend: {
  <A, B>(
    fab: (fa: ReadonlyArray<A>) => B,
  ): (self: ReadonlyArray<A>) => ReadonlyArray<B>
} = Extendable.extend

export const duplicate: {
  <A>(self: ReadonlyArray<A>): ReadonlyArray<ReadonlyArray<A>>
} = Extendable.duplicate
