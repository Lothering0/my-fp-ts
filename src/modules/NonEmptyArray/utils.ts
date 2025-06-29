import { overload } from "../../utils/overloads"
import { NonEmptyArray } from "./non-empty-array"
import { getSemigroup } from "./semigroup"

export const head: {
  <A>(as: NonEmptyArray<A>): A
} = as => as.at (0)!

export const init: {
  <A>(as: NonEmptyArray<A>): A[]
} = as => as.slice (0, -1)

export const last: {
  <A>(as: NonEmptyArray<A>): A
} = as => as.at (-1)!

export const tail: {
  <A>(as: NonEmptyArray<A>): A[]
} = as => as.slice (1)

export const concat: {
  <A>(end: A[]): (start: NonEmptyArray<A>) => NonEmptyArray<A>
  <A>(end: NonEmptyArray<A>): (start: A[]) => NonEmptyArray<A>
  <A>(start: NonEmptyArray<A>, end: A[]): NonEmptyArray<A>
  <A>(start: A[], end: NonEmptyArray<A>): NonEmptyArray<A>
} = overload (1, getSemigroup ().concat)
