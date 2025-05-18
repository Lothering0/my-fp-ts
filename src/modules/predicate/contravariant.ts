import { _URI } from "./predicate"
import { Contravariant, createContravariant } from "../../types/Contravariant"
import { compose } from "../identity"

export const contravariant: Contravariant<typeof _URI> = createContravariant ({
  _URI,
  contramap: compose,
})

export const { contramap } = contravariant
