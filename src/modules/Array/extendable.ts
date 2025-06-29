import { overload } from "src/utils/overloads"
import { Extendable } from "../../types/Extendable"
import { ArrayHKT } from "./array"
import { functor } from "./functor"
import { matchLeft, prepend } from "./utils"

export const extendable: Extendable<ArrayHKT> = {
  ...functor,
  extend: overload (1, <A, B>(self: A[], fab: (fa: A[]) => B): B[] =>
    matchLeft (
      self,
      () => [],
      (head, tail) => [fab (prepend (head, tail)), ...extend (tail, fab)],
    ),
  ),
}

export const { extend } = extendable
