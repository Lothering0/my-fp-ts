import * as A from "../Array"
import { NonEmptyArray } from "./non-empty-array"
import { Show } from "../../types/Show"

export const getShow: {
  <A>(S: Show<A>): Show<NonEmptyArray<A>>
} = A.getShow
