import * as NEA from "../NonEmptyArray"
import { Semigroup } from "../../types/Semigroup"

export const concat: {
  <A>(end: A[]): (start: A[]) => A[]
  <A>(start: A[], end: A[]): A[]
} = NEA.concat

export const getSemigroup = <A>(): Semigroup<Array<A>> => ({
  concat,
})
