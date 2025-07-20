import { Semigroup } from "../../types/Semigroup"
import { NonEmptyArray } from "./non-empty-array"
import { overload } from "../../utils/overloads"

export const concat: {
  <A>(end: A[]): (start: NonEmptyArray<A>) => NonEmptyArray<A>
  <A>(end: NonEmptyArray<A>): (start: A[]) => NonEmptyArray<A>
  <A>(start: NonEmptyArray<A>, end: A[]): NonEmptyArray<A>
  <A>(start: A[], end: NonEmptyArray<A>): NonEmptyArray<A>
} = overload (1, (xs, ys) => xs.concat (ys) as NonEmptyArray<unknown>)

export const getSemigroup: {
  <A>(): Semigroup<NonEmptyArray<A>>
} = () => ({
  concat,
})
