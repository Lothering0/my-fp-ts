import { Extendable2, createExtendable2 } from "../../types/Extendable"
import { URI } from "./either"
import { functor, map } from "./functor"

export const extendable: Extendable2<URI> = createExtendable2 ({
  ...functor,
  extend: (fa, f) => map (fa, () => f (fa)),
})

export const { extend } = extendable
