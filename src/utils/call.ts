import { LazyArg } from "../types/utils"
import { flip } from "./flip"

export const call0: {
  <A>(f: LazyArg<A>): A
} = f => f ()

export const call: {
  <A, B>(ab: (a: A) => B): (a: A) => B
} = ab => a => ab (a)

export const callWith: {
  <A, B>(a: A): (ab: (a: A) => B) => B
} = flip (call)
