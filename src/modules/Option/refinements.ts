import { Option, None, Some } from "./option"
import { isRecord } from "../../utils/typeChecks"

export const isSome: {
  <A>(self: Option<A>): self is Some<A>
} = self => self._tag === "Some"

export const isNone: {
  <A>(self: Option<A>): self is None
} = self => self._tag === "None"

export const isOption = (x: unknown): x is Option<unknown> => {
  if (!isRecord (x)) {
    return false
  }
  const value = x as unknown as Option<unknown>
  return isNone (value) || isSome (value)
}
