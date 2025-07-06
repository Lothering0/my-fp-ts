import * as NEA from "../../NonEmptyArray"
import { overload } from "../../../utils/overloads"
import { LazyArg } from "../../../types/utils"
import { isNonEmpty } from "./utils"

export const match: {
  <A, B>(
    whenEmpty: LazyArg<B>,
    whenNonEmpty: (as: NEA.NonEmptyArray<A>) => B,
  ): (self: A[]) => B
  <A, B>(
    self: A[],
    whenEmpty: LazyArg<B>,
    whenNonEmpty: (as: NEA.NonEmptyArray<A>) => B,
  ): B
} = overload (2, (self, whenEmpty, whenNonEmpty) =>
  isNonEmpty (self) ? whenNonEmpty (self) : whenEmpty (),
)

export const matchLeft: {
  <A, B>(
    whenEmpty: LazyArg<B>,
    whenNonEmpty: (head: A, tail: A[]) => B,
  ): (self: A[]) => B
  <A, B>(
    self: A[],
    whenEmpty: LazyArg<B>,
    whenNonEmpty: (head: A, tail: A[]) => B,
  ): B
} = overload (2, (self, whenEmpty, whenNonEmpty) =>
  isNonEmpty (self) ? whenNonEmpty (NEA.head (self), NEA.tail (self)) : whenEmpty (),
)

export const matchRight: {
  <A, B>(
    whenEmpty: LazyArg<B>,
    whenNonEmpty: (init: A[], last: A) => B,
  ): (self: A[]) => B
  <A, B>(
    self: A[],
    whenEmpty: LazyArg<B>,
    whenNonEmpty: (init: A[], last: A) => B,
  ): B
} = overload (
  2,
  <A, B>(
    as: A[],
    whenEmpty: LazyArg<B>,
    whenNonEmpty: (init: A[], last: A) => B,
  ) =>
    isNonEmpty (as) ? whenNonEmpty (NEA.init (as), NEA.last (as)) : whenEmpty (),
)
