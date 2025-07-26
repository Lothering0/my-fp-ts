import * as NERA from "../../NonEmptyReadonlyArray"
import { LazyArg } from "../../../types/utils"
import { isNonEmpty } from "../refinements"

export const match: {
  <A, B>(
    onEmpty: LazyArg<B>,
    onNonEmpty: (as: NERA.NonEmptyReadonlyArray<A>) => B,
  ): (self: ReadonlyArray<A>) => B
} = (onEmpty, onNonEmpty) => self =>
  isNonEmpty (self) ? onNonEmpty (self) : onEmpty ()

export const matchLeft: {
  <A, B>(
    onEmpty: LazyArg<B>,
    onNonEmpty: (head: A, tail: ReadonlyArray<A>) => B,
  ): (self: ReadonlyArray<A>) => B
} = (onEmpty, onNonEmpty) => self =>
  isNonEmpty (self) ? onNonEmpty (NERA.head (self), NERA.tail (self)) : onEmpty ()

export const matchRight: {
  <A, B>(
    onEmpty: LazyArg<B>,
    onNonEmpty: (init: ReadonlyArray<A>, last: A) => B,
  ): (self: ReadonlyArray<A>) => B
} = (onEmpty, onNonEmpty) => self =>
  isNonEmpty (self) ? onNonEmpty (NERA.init (self), NERA.last (self)) : onEmpty ()
