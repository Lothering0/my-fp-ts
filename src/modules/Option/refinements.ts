import { Option, None, Some } from "./option"
import { isRecord } from "../../utils/typeChecks"

export const isSome: {
  <A>(self: Option<A>): self is Some<A>
} = self => self._tag === "Some"

export const isNone: {
  <A>(self: Option<A>): self is None
} = self => self._tag === "None"

export const isOption = (x: unknown): x is Option<unknown> =>
  isRecord (x) &&
  (isNone (x as unknown as Option<unknown>) ||
    isSome (x as unknown as Option<unknown>))
