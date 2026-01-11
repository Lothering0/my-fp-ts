import * as Option from '../Option'
import { LazyArg } from '../../types/utils'
import { pipe } from '../../utils/flow'
import { List } from './list'
import { isCons } from './refinements'
import { init, last } from './utils'
import { absurd } from '../../utils/absurd'

export interface Matchers<A, B, C = B> {
  readonly onNil: LazyArg<B>
  readonly onCons: (a: A) => C
}

/**
 * | Time complexity |
 * | --------------- |
 * | O(1)            |
 */
export const match: {
  <A, B, C = B>(matchers: Matchers<A, B, C>): (list: List<A>) => B | C
} = matchers => list =>
  isCons(list) ? matchers.onCons(list.head) : matchers.onNil()

export interface MatchersLeft<A, B, C = B> {
  readonly onNil: LazyArg<B>
  readonly onCons: (head: A, tail: List<A>) => C
}

/**
 * | Time complexity | Space complexity |
 * | --------------- | ---------------- |
 * | O(1)            | O(1)             |
 */
export const matchLeft: {
  <A, B, C = B>(matchers: MatchersLeft<A, B, C>): (list: List<A>) => B | C
} = matchers => list =>
  isCons(list) ? matchers.onCons(list.head, list.tail) : matchers.onNil()

export interface MatchersRight<A, B, C = B> {
  readonly onNil: LazyArg<B>
  readonly onCons: (init: List<A>, last: A) => C
}

/**
 * | Time complexity | Space complexity |
 * | --------------- | ---------------- |
 * | O(n)            | O(1)             |
 */
export const matchRight =
  <A, B, C = B>(matchers: MatchersRight<A, B, C>) =>
  (list: List<A>): B | C =>
    isCons(list)
      ? matchers.onCons(
          pipe(list, init, Option.getOrElse<List<A>>(absurd)),
          pipe(list, last, Option.getOrElse<A>(absurd)),
        )
      : matchers.onNil()
