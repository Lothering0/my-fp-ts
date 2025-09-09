import * as readonlyArray from "../ReadonlyArray"
import * as ord from "../../typeclasses/Ord"
import { NonEmptyReadonlyArray } from "./non-empty-readonly-array"

export const getOrd: {
  <A>(Ord: ord.Ord<A>): ord.Ord<NonEmptyReadonlyArray<A>>
} = readonlyArray.getOrd
