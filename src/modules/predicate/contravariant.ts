import { Contravariant, createContravariant } from "../../types/Contravariant"
import { compose } from "../identity"

export const contravariant: Contravariant<"Predicate"> = createContravariant ({
  _URI: "Predicate",
  contramap: compose,
})

export const { contramap } = contravariant
