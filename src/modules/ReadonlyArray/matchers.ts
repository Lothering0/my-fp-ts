import * as nonEmptyReadonlyArray from "../NonEmptyReadonlyArray"
import { LazyArg } from "../../types/utils"
import { isNonEmpty } from "./refinements"

export interface Matchers<A, B, C = B> {
  readonly onEmpty: LazyArg<B>
  readonly onNonEmpty: (as: nonEmptyReadonlyArray.NonEmptyReadonlyArray<A>) => C
}

export const match: {
  <A, B, C = B>(matchers: Matchers<A, B, C>): (self: ReadonlyArray<A>) => B | C
} = matchers => self =>
  isNonEmpty (self) ? matchers.onNonEmpty (self) : matchers.onEmpty ()

export interface MatchersLeft<A, B, C = B> {
  readonly onEmpty: LazyArg<B>
  readonly onNonEmpty: (head: A, tail: ReadonlyArray<A>) => C
}

export const matchLeft: {
  <A, B, C = B>(
    matchers: MatchersLeft<A, B, C>,
  ): (self: ReadonlyArray<A>) => B | C
} = matchers => self =>
  isNonEmpty (self)
    ? matchers.onNonEmpty (
        nonEmptyReadonlyArray.head (self),
        nonEmptyReadonlyArray.tail (self),
      )
    : matchers.onEmpty ()

export interface MatchersRight<A, B, C = B> {
  readonly onEmpty: LazyArg<B>
  readonly onNonEmpty: (init: ReadonlyArray<A>, last: A) => C
}

export const matchRight: {
  <A, B, C = B>(
    matchers: MatchersRight<A, B, C>,
  ): (self: ReadonlyArray<A>) => B | C
} = matchers => self =>
  isNonEmpty (self)
    ? matchers.onNonEmpty (
        nonEmptyReadonlyArray.init (self),
        nonEmptyReadonlyArray.last (self),
      )
    : matchers.onEmpty ()
