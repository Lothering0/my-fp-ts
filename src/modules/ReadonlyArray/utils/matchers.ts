import * as NERA from "../../NonEmptyReadonlyArray"
import { overload } from "../../../utils/overloads"
import { LazyArg } from "../../../types/utils"
import { isNonEmpty } from "../refinements"

export const match: {
  <A, B>(
    onEmpty: LazyArg<B>,
    onNonEmpty: (as: NERA.NonEmptyReadonlyArray<A>) => B,
  ): (self: ReadonlyArray<A>) => B
  <A, B>(
    self: ReadonlyArray<A>,
    onEmpty: LazyArg<B>,
    onNonEmpty: (as: NERA.NonEmptyReadonlyArray<A>) => B,
  ): B
} = overload (2, (self, onEmpty, onNonEmpty) =>
  isNonEmpty (self) ? onNonEmpty (self) : onEmpty (),
)

export const matchLeft: {
  <A, B>(
    onEmpty: LazyArg<B>,
    onNonEmpty: (head: A, tail: ReadonlyArray<A>) => B,
  ): (self: ReadonlyArray<A>) => B
  <A, B>(
    self: ReadonlyArray<A>,
    onEmpty: LazyArg<B>,
    onNonEmpty: (head: A, tail: ReadonlyArray<A>) => B,
  ): B
} = overload (2, (self, onEmpty, onNonEmpty) =>
  isNonEmpty (self) ? onNonEmpty (NERA.head (self), NERA.tail (self)) : onEmpty (),
)

export const matchRight: {
  <A, B>(
    onEmpty: LazyArg<B>,
    onNonEmpty: (init: ReadonlyArray<A>, last: A) => B,
  ): (self: ReadonlyArray<A>) => B
  <A, B>(
    self: ReadonlyArray<A>,
    onEmpty: LazyArg<B>,
    onNonEmpty: (init: ReadonlyArray<A>, last: A) => B,
  ): B
} = overload (
  2,
  <A, B>(
    as: ReadonlyArray<A>,
    onEmpty: LazyArg<B>,
    onNonEmpty: (init: ReadonlyArray<A>, last: A) => B,
  ) => isNonEmpty (as) ? onNonEmpty (NERA.init (as), NERA.last (as)) : onEmpty (),
)
