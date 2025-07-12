import * as NEA from "../NonEmptyArray"
import { length } from "./utils"

export const isEmpty = <A>(self: A[]): self is [] => length (self) === 0

export const isNonEmpty = <A>(self: A[]): self is NEA.NonEmptyArray<A> =>
  !isEmpty (self)
