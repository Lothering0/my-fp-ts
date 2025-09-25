import * as nonEmptyArray from "../NonEmptyReadonlyArray"
import { length } from "./utils"

export const isEmpty = <A>(self: ReadonlyArray<A>): self is readonly [] =>
  length (self) === 0

export const isNonEmpty = <A>(
  self: ReadonlyArray<A>,
): self is nonEmptyArray.NonEmptyReadonlyArray<A> => !isEmpty (self)
