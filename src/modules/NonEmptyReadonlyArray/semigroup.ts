import { Semigroup } from "../../types/Semigroup"
import { NonEmptyReadonlyArray } from "./non-empty-readonly-array"
import { overload } from "../../utils/overloads"

export const concat: {
  <A>(
    end: ReadonlyArray<A>,
  ): (start: NonEmptyReadonlyArray<A>) => NonEmptyReadonlyArray<A>
  <A>(
    end: NonEmptyReadonlyArray<A>,
  ): (start: ReadonlyArray<A>) => NonEmptyReadonlyArray<A>
  <A>(
    start: NonEmptyReadonlyArray<A>,
    end: ReadonlyArray<A>,
  ): NonEmptyReadonlyArray<A>
  <A>(
    start: ReadonlyArray<A>,
    end: NonEmptyReadonlyArray<A>,
  ): NonEmptyReadonlyArray<A>
} = overload (
  1,
  (xs, ys) =>
    xs.concat (ys) as [
      unknown,
      ...ReadonlyArray<unknown>,
    ] as NonEmptyReadonlyArray<unknown>,
)

export const getSemigroup: {
  <A>(): Semigroup<NonEmptyReadonlyArray<A>>
} = () => ({
  concat,
})
