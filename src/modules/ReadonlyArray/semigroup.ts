import * as nonEmptyReadonlyArray from "../NonEmptyReadonlyArray"
import { Semigroup } from "../../types/Semigroup"

export const concat: {
  <A>(end: ReadonlyArray<A>): (start: ReadonlyArray<A>) => ReadonlyArray<A>
} = nonEmptyReadonlyArray.concat

export const getSemigroup = <A>(): Semigroup<ReadonlyArray<A>> => ({
  concat,
})
