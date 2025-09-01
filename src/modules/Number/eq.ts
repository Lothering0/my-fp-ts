import * as eq from "../../typeclasses/Eq"

export const Eq: eq.Eq<number> = eq.EqStrict

export const { equals } = Eq
