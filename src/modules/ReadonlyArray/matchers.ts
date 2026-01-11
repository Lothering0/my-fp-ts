import * as Array from './readonly-array'
import { LazyArg } from '../../types/utils'
import { isNonEmpty } from './refinements'
import { headNonEmpty, initNonEmpty, lastNonEmpty, tailNonEmpty } from './utils'

export interface Matchers<A, B, C = B> {
  readonly onEmpty: LazyArg<B>
  readonly onNonEmpty: (array: Array.NonEmpty<A>) => C
}

export const match: {
  <A, B, C = B>(matchers: Matchers<A, B, C>): (self: ReadonlyArray<A>) => B | C
} = matchers => self =>
  isNonEmpty(self) ? matchers.onNonEmpty(self) : matchers.onEmpty()

export interface MatchersLeft<A, B, C = B> {
  readonly onEmpty: LazyArg<B>
  readonly onNonEmpty: (head: A, tail: ReadonlyArray<A>) => C
}

export const matchLeft: {
  <A, B, C = B>(
    matchers: MatchersLeft<A, B, C>,
  ): (self: ReadonlyArray<A>) => B | C
} = matchers => self =>
  isNonEmpty(self)
    ? matchers.onNonEmpty(headNonEmpty(self), tailNonEmpty(self))
    : matchers.onEmpty()

export interface MatchersRight<A, B, C = B> {
  readonly onEmpty: LazyArg<B>
  readonly onNonEmpty: (init: ReadonlyArray<A>, last: A) => C
}

export const matchRight: {
  <A, B, C = B>(
    matchers: MatchersRight<A, B, C>,
  ): (self: ReadonlyArray<A>) => B | C
} = matchers => self =>
  isNonEmpty(self)
    ? matchers.onNonEmpty(initNonEmpty(self), lastNonEmpty(self))
    : matchers.onEmpty()
