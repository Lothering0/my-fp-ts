import * as nonEmptyReadonlyArray from "../../NonEmptyReadonlyArray"
import { LazyArg } from "../../../types/utils"
import { isNonEmpty } from "../refinements"

export const match: {
  <A, B>(
    onEmpty: LazyArg<B>,
    onNonEmpty: (as: nonEmptyReadonlyArray.NonEmptyReadonlyArray<A>) => B,
  ): (self: ReadonlyArray<A>) => B
} = (onEmpty, onNonEmpty) => self =>
  isNonEmpty (self) ? onNonEmpty (self) : onEmpty ()

export const matchLeft: {
  <A, B>(
    onEmpty: LazyArg<B>,
    onNonEmpty: (head: A, tail: ReadonlyArray<A>) => B,
  ): (self: ReadonlyArray<A>) => B
} = (onEmpty, onNonEmpty) => self =>
  isNonEmpty (self)
    ? onNonEmpty (
        nonEmptyReadonlyArray.head (self),
        nonEmptyReadonlyArray.tail (self),
      )
    : onEmpty ()

export const matchRight: {
  <A, B>(
    onEmpty: LazyArg<B>,
    onNonEmpty: (init: ReadonlyArray<A>, last: A) => B,
  ): (self: ReadonlyArray<A>) => B
} = (onEmpty, onNonEmpty) => self =>
  isNonEmpty (self)
    ? onNonEmpty (
        nonEmptyReadonlyArray.init (self),
        nonEmptyReadonlyArray.last (self),
      )
    : onEmpty ()
