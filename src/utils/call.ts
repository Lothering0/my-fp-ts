import { flip } from "./flip"

type Call0 = <A>(f: () => A) => A
export const call0: Call0 = f => f ()

type Call = <A, B>(f: (a: A) => B) => (a: A) => B
export const call: Call = f => a => f (a)

type CallWith = <A, B>(a: A) => (f: (a: A) => B) => B
export const callWith: CallWith = flip (call)
