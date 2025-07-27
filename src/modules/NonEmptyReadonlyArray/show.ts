import * as readonlyArray from "../ReadonlyArray"
import { NonEmptyReadonlyArray } from "./non-empty-readonly-array"
import { Show } from "../../types/Show"

export const getShow: {
  <A>(S: Show<A>): Show<NonEmptyReadonlyArray<A>>
} = readonlyArray.getShow
