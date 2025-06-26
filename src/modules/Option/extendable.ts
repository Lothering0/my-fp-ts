import { Extendable, createExtendable } from "../../types/Extendable"
import { URI } from "./option"
import { functor, map } from "./functor"

export const extendable: Extendable<URI> = createExtendable ({
  ...functor,
  extend: (fa, f) => map (fa, () => f (fa)),
})

export const { extend } = extendable
