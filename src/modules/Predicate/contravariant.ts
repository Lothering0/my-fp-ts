import { URI } from "./predicate"
import { Contravariant, createContravariant } from "../../types/Contravariant"
import { compose } from "../Identity"

export const contravariant: Contravariant<URI> = createContravariant ({
  URI,
  contramap: compose,
})

export const { contramap } = contravariant
