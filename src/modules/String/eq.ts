import * as eq from "../../typeclasses/Eq"

export const Eq: eq.Eq<string> = eq.EqStrict

export const { equals } = Eq
