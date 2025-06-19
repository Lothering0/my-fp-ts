import { overload } from "../../utils/overloads"
import { NonEmptyArray } from "./non-empty-array"
import { getSemigroup } from "./semigroup"

type Head = <A>(as: NonEmptyArray<A>) => A
export const head: Head = as => as.at (0)!

type Init = <A>(as: NonEmptyArray<A>) => A[]
export const init: Init = as => as.slice (0, -1)

type Last = <A>(as: NonEmptyArray<A>) => A
export const last: Last = as => as.at (-1)!

type Tail = <A>(as: NonEmptyArray<A>) => A[]
export const tail: Tail = as => as.slice (1)

interface ConcatPointed {
  <A>(start: NonEmptyArray<A>, end: A[]): NonEmptyArray<A>
  <A>(start: A[], end: NonEmptyArray<A>): NonEmptyArray<A>
}

interface ConcatPointFree {
  <A>(end: A[]): (start: NonEmptyArray<A>) => NonEmptyArray<A>
  <A>(end: NonEmptyArray<A>): (start: A[]) => NonEmptyArray<A>
}

interface Concat extends ConcatPointed, ConcatPointFree {}

export const concat: Concat = overload (getSemigroup ().concat)
