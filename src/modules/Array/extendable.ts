import { Extendable, createExtendable } from "../../types/Extendable"
import { URI } from "./array"
import { functor } from "./functor"
import { matchLeft, prepend } from "./utils"

export const extendable: Extendable<URI> = createExtendable ({
  ...functor,
  extend: (fa, f) =>
    matchLeft (
      fa,
      () => [],
      (head, tail) => [f (prepend (head, tail)), ...extend (tail, f)],
    ),
})

export const { extend } = extendable
