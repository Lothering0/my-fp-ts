import * as Option from '../Option'
import * as List from '../List'
import { pipe } from '../../utils/flow'
import { NonEmptyList } from './non-empty-list'
import { absurd } from '../../utils/absurd'

/**
 * | Time complexity |
 * | --------------- |
 * | O(1)            |
 */
export const head: {
  <A>(list: NonEmptyList<A>): A
} = list => list.head

/**
 * | Time complexity | Space complexity |
 * | --------------- | ---------------- |
 * | O(n)            | O(1)             |
 */
export const init = <A>(list: NonEmptyList<A>): List.List<A> =>
  pipe(list, List.init, Option.getOrElse<List.List<A>>(absurd))

/**
 * | Time complexity |
 * | --------------- |
 * | O(1)            |
 */
export const last = <A>(list: NonEmptyList<A>): A =>
  pipe(list, List.last, Option.getOrElse<A>(absurd))

/**
 * | Time complexity | Space complexity |
 * | --------------- | ---------------- |
 * | O(1)            | O(1)             |
 */
export const tail = <A>(list: NonEmptyList<A>): List.List<A> =>
  pipe(list, List.tail, Option.getOrElse<List.List<A>>(absurd))

/**
 * | Time complexity | Space complexity |
 * | --------------- | ---------------- |
 * | O(n)            | O(n)             |
 */
export const concat: {
  <A>(end: List.List<A>): (start: NonEmptyList<A>) => NonEmptyList<A>
  <A>(end: NonEmptyList<A>): (start: List.List<A>) => NonEmptyList<A>
} =
  <A>(end: NonEmptyList<A>) =>
  (start: List.List<A>): NonEmptyList<A> =>
    List.concat(end)(start) as NonEmptyList<A>

/**
 * | Time complexity | Space complexity |
 * | --------------- | ---------------- |
 * | O(n)            | O(n)             |
 */
export const reverse = <A>(list: NonEmptyList<A>): NonEmptyList<A> =>
  List.reverse(list) as NonEmptyList<A>
