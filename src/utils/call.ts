import { LazyArg } from "../types/utils"
import { flip } from "./flip"

export const call0: {
  <Out>(f: LazyArg<Out>): Out
} = f => f ()

export const call: {
  <In, Out>(ab: (a: In) => Out): (a: In) => Out
} = ab => a => ab (a)

export const callWith: {
  <In, Out>(a: In): (ab: (a: In) => Out) => Out
} = flip (call)
