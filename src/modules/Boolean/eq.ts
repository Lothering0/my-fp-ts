import * as eq from "../../typeclasses/Eq"

export const Eq: eq.Eq<boolean> = eq.EqStrict

export const { equals } = Eq
