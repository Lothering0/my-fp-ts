import { NonEmptyArray } from "./non-empty-array"

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
