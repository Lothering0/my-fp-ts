import { flow, pipe } from "../../utils/flow"
import { identity } from "../Identity"
import { Reader } from "./reader"

export const ask: {
  <R>(): Reader<R, R>
} = () => identity

export const asks: {
  <R, A>(f: (r: R) => A): Reader<R, A>
} = identity

export const asksReader: {
  <R1, R2, A>(f: (r: R1) => Reader<R2, A>): Reader<R1 & R2, A>
} = f => reader => pipe (reader, f (reader))

export const local: {
  <R1, R2>(f: (r2: R2) => R1): <A>(self: Reader<R1, A>) => Reader<R2, A>
} = f => self => flow (f, self)
