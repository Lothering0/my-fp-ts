import { Semigroup } from "../../types/Semigroup"
import { NonEmptyReadonlyArray } from "./non-empty-readonly-array"

export const concat: {
  <A>(
    end: ReadonlyArray<A>,
  ): (start: NonEmptyReadonlyArray<A>) => NonEmptyReadonlyArray<A>
  <A>(
    end: NonEmptyReadonlyArray<A>,
  ): (start: ReadonlyArray<A>) => NonEmptyReadonlyArray<A>
} = end => start =>
  start.concat (end) as [
    unknown,
    ...ReadonlyArray<unknown>,
  ] as NonEmptyReadonlyArray<unknown>

export const getSemigroup: {
  <A>(): Semigroup<NonEmptyReadonlyArray<A>>
} = () => ({
  concat,
})
