import * as readonlyArray from "../ReadonlyArray"
import { Eq } from "../../typeclasses/Eq"
import { NonEmptyReadonlyArray } from "./non-empty-readonly-array"

export const getEq: {
  <A>(Eq: Eq<A>): Eq<NonEmptyReadonlyArray<A>>
} = readonlyArray.getEq
