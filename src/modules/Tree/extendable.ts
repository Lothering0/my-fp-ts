import * as A from "../Array"
import { Extendable, createExtendable } from "../../types/Extendable"
import { URI } from "./tree"
import { functor } from "./functor"
import { forestOf, make } from "./utils"

export const extendable: Extendable<URI> = createExtendable ({
  ...functor,
  extend: (fa, f) => make (f (fa), A.map (forestOf (fa), extend (f))),
})

export const { extend } = extendable
