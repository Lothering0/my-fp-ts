import { createExtendable } from "../../types/Extendable"
import { overload } from "../../utils/overloads"
import { ReadonlyArrayHKT } from "./readonly-array"
import { Functor } from "./functor"
import { matchLeft, prepend } from "./utils"

export const Extendable = createExtendable<ReadonlyArrayHKT> ({
  ...Functor,
  extend: overload (
    1,
    <A, B>(
      self: ReadonlyArray<A>,
      fab: (fa: ReadonlyArray<A>) => B,
    ): ReadonlyArray<B> =>
      matchLeft (
        self,
        () => [] as ReadonlyArray<B>,
        (head, tail) => prepend (fab (prepend (head, tail)), extend (tail, fab)),
      ),
  ),
})

export const extend: {
  <A, B>(
    fab: (fa: ReadonlyArray<A>) => B,
  ): (self: ReadonlyArray<A>) => ReadonlyArray<B>
  <A, B>(
    self: ReadonlyArray<A>,
    fab: (fa: ReadonlyArray<A>) => B,
  ): ReadonlyArray<B>
} = Extendable.extend

export const duplicate: {
  <A>(self: ReadonlyArray<A>): ReadonlyArray<ReadonlyArray<A>>
} = Extendable.duplicate
