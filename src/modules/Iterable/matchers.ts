import * as Iterable from './iterable'
import { LazyArg } from '../../types/utils'
import { isNonEmpty } from './refinements'
import { headNonEmpty, initNonEmpty, lastNonEmpty, tailNonEmpty } from './utils'

export interface Matchers<A, B, C = B> {
  readonly onEmpty: LazyArg<B>
  readonly onNonEmpty: (iterable: Iterable.NonEmpty<A>) => C
}

export const match: {
  <A, B, C = B>(matchers: Matchers<A, B, C>): (iterable: Iterable<A>) => B | C
} = matchers => iterable =>
  isNonEmpty(iterable) ? matchers.onNonEmpty(iterable) : matchers.onEmpty()

export interface MatchersLeft<A, B, C = B> {
  readonly onEmpty: LazyArg<B>
  readonly onNonEmpty: (head: A, tail: Iterable<A>) => C
}

export const matchLeft: {
  <A, B, C = B>(
    matchers: MatchersLeft<A, B, C>,
  ): (iterable: Iterable<A>) => B | C
} = matchers => iterable =>
  isNonEmpty(iterable)
    ? matchers.onNonEmpty(headNonEmpty(iterable), tailNonEmpty(iterable))
    : matchers.onEmpty()

export interface MatchersRight<A, B, C = B> {
  readonly onEmpty: LazyArg<B>
  readonly onNonEmpty: (init: Iterable<A>, last: A) => C
}

export const matchRight: {
  <A, B, C = B>(
    matchers: MatchersRight<A, B, C>,
  ): (iterable: Iterable<A>) => B | C
} = matchers => iterable =>
  isNonEmpty(iterable)
    ? matchers.onNonEmpty(initNonEmpty(iterable), lastNonEmpty(iterable))
    : matchers.onEmpty()
