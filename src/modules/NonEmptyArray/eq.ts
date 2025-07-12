import * as A from "../Array"
import { Eq } from "../../types/Eq"
import { NonEmptyArray } from "./non-empty-array"

export const getEq: {
  <A>(Eq: Eq<A>): Eq<NonEmptyArray<A>>
} = A.getEq
