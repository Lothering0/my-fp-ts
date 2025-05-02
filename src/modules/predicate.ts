import { Contravariant, createContravariant } from "../types/Contravariant"
import { compose } from "./identity"

declare module "../types/Kind" {
  export interface Kind<A> {
    readonly Predicate: Predicate<A>
  }
}

export interface Predicate<A> {
  (a: A): boolean
}

export const contravariant: Contravariant<"Predicate"> = createContravariant ({
  _URI: "Predicate",
  contramap: compose,
})

export const { contramap } = contravariant
