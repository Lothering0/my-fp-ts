import * as readonlyArray from "../ReadonlyArray"
import { Equivalence } from "../../typeclasses/Equivalence"
import { NonEmptyReadonlyArray } from "./non-empty-readonly-array"

export const getEquivalence: {
  <A>(Equivalence: Equivalence<A>): Equivalence<NonEmptyReadonlyArray<A>>
} = readonlyArray.getEquivalence
