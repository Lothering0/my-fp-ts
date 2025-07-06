import * as NEA from "../../NonEmptyArray"
import { overload } from "../../../utils/overloads"
import { LazyArg } from "../../../types/utils"
import { isNonEmpty } from "./utils"

export const match: {
  <A, B>(
    onEmpty: LazyArg<B>,
    onNonEmpty: (as: NEA.NonEmptyArray<A>) => B,
  ): (self: A[]) => B
  <A, B>(
    self: A[],
    onEmpty: LazyArg<B>,
    onNonEmpty: (as: NEA.NonEmptyArray<A>) => B,
  ): B
} = overload (2, (self, onEmpty, onNonEmpty) =>
  isNonEmpty (self) ? onNonEmpty (self) : onEmpty (),
)

export const matchLeft: {
  <A, B>(
    onEmpty: LazyArg<B>,
    onNonEmpty: (head: A, tail: A[]) => B,
  ): (self: A[]) => B
  <A, B>(
    self: A[],
    onEmpty: LazyArg<B>,
    onNonEmpty: (head: A, tail: A[]) => B,
  ): B
} = overload (2, (self, onEmpty, onNonEmpty) =>
  isNonEmpty (self) ? onNonEmpty (NEA.head (self), NEA.tail (self)) : onEmpty (),
)

export const matchRight: {
  <A, B>(
    onEmpty: LazyArg<B>,
    onNonEmpty: (init: A[], last: A) => B,
  ): (self: A[]) => B
  <A, B>(
    self: A[],
    onEmpty: LazyArg<B>,
    onNonEmpty: (init: A[], last: A) => B,
  ): B
} = overload (
  2,
  <A, B>(
    as: A[],
    onEmpty: LazyArg<B>,
    onNonEmpty: (init: A[], last: A) => B,
  ) => isNonEmpty (as) ? onNonEmpty (NEA.init (as), NEA.last (as)) : onEmpty (),
)
