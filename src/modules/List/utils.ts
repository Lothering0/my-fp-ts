import * as Array from '../ReadonlyArray'
import * as Iterable from '../Iterable'
import * as Option from '../Option'
import * as List from './list'
import { flow, pipe } from '../../utils/flow'
import { match } from './matchers'
import { isNil } from './refinements'
import { RefinementWithIndex } from '../Refinement'
import { PredicateWithIndex } from '../Predicate'
import { Equivalence } from '../../typeclasses/Equivalence'
import { reduceRight } from './foldable'
import { constant } from '../../utils/constant'
import { _cons, _internal } from './_internal'

export const fromReadonlyArray: {
  <A>(array: ReadonlyArray<A>): List.List<A>
  // Not reusing `Iterable.reduceRight` for performance optimization
} = Array.reduceRight(List.nil(), (x, list) => List.cons(x, list))

export const fromIterable: {
  <A>(as: Iterable<A>): List.List<A>
} = Iterable.reduceRight(List.nil(), (a, list) => List.cons(a, list))

export const copy: {
  <A>(list: List.List<A>): List.List<A>
} = fromIterable

/** Time complexity: O(1) */
export const length: {
  <A>(list: List.List<A>): number
} = list => list.length

/** Time complexity: O(n) */
export const reverse = <A>(list: List.List<A>): List.List<A> => {
  let out = List.nil<A>()
  while (!isNil(list)) {
    out = List.cons(list.head, out)
    list = list.tail
  }
  return out
}

/** Time complexity: O(1) */
export const prepend: {
  <A>(a: A): (list: List.List<A>) => List.List<A>
} = a => list => List.cons(a, list)

/** Time complexity: O(1) */
export const append =
  <A>(a: A) =>
  (list: List.List<A>): List.List<A> => {
    const newNode = _cons(a)
    if (isNil(list)) {
      return newNode
    }
    const newList = _cons(list.head, list.tail, list.length + 1)
    newList[_internal].last = newNode
    return newList
  }

/** Time complexity: O(1) */
export const head: {
  <A>(list: List.List<A>): Option.Option<A>
} = match({
  onCons: Option.some,
  onNil: Option.none,
})

/** Time complexity: O(1) */
export const tail: {
  <A>(list: List.List<A>): Option.Option<List.List<A>>
} = list => {
  if (isNil(list)) {
    return Option.none()
  }
  if (isNil(list.tail)) {
    return Option.some(list.tail)
  }
  const newList = _cons(list.tail.head, list.tail.tail, list.length - 1)
  return Option.some(newList)
}

/** Time complexity: O(1) */
export const last: {
  <A>(list: List.List<A>): Option.Option<A>
} = list => {
  const lastNode = list[_internal].last
  return lastNode ? Option.some(lastNode.head) : Option.none()
}

/** Time complexity: O(n) */
export const init = <A>(list: List.List<A>): Option.Option<List.List<A>> => {
  if (isNil(list)) {
    return Option.none()
  }
  let out: List.List<A> = List.nil()
  while (!isNil(list.tail)) {
    out = List.cons(list.head, out)
    list = list.tail
  }
  return Option.some(out)
}

/** Time complexity: O(n) */
export const lastIndex: {
  (list: List.List<unknown>): number
} = Iterable.lastIndex

/** Time complexity: O(1) */
export const has: {
  (i: number): <A>(list: List.List<A>) => boolean
} = i => list => Number.isInteger(i) && i >= 0 && i < list.length

/** Time complexity: O(1) */
export const isOutOfBounds: {
  (i: number): <A>(list: List.List<A>) => boolean
} = i => list => !has(i)(list)

/** Time complexity: O(n) */
export const lookup: {
  (i: number): <A>(list: List.List<A>) => Option.Option<A>
} = Iterable.lookup

/**
 * Time complexity: O(n).
 *
 * Like `lookup` but accepts also negative integers where -1 is index of the last element, -2 of the pre-last and so on.
 */
export const at: {
  (i: number): <A>(list: List.List<A>) => Option.Option<A>
} = i => list => {
  const nonNegativeIndex = i < 0 ? length(list) + i : i
  return lookup(nonNegativeIndex)(list)
}

export const findMap: {
  <A, B>(
    aimb: (a: A, i: number) => Option.Option<B>,
  ): (list: List.List<A>) => Option.Option<B>
} = Iterable.findMap

export const find: {
  <A, B extends A>(
    p: RefinementWithIndex<A, B, number>,
  ): (list: List.List<A>) => Option.Option<B>
  <A>(
    p: PredicateWithIndex<A, number>,
  ): (list: List.List<A>) => Option.Option<A>
} = Iterable.find

export const findIndex: {
  <A>(
    p: PredicateWithIndex<A, number>,
  ): (list: List.List<A>) => Option.Option<number>
} = Iterable.findIndex

export const findLastMap: {
  <A, B>(
    aimb: (a: A, i: number) => Option.Option<B>,
  ): (list: List.List<A>) => Option.Option<B>
} = aimb => list => {
  const listLength = length(list)
  return pipe(
    list,
    reverse,
    findMap((a, i) => aimb(a, listLength - i - 1)),
  )
}

export const findLast: {
  <A, B extends A>(
    p: RefinementWithIndex<A, B, number>,
  ): (list: List.List<A>) => Option.Option<B>
  <A>(
    p: PredicateWithIndex<A, number>,
  ): (list: List.List<A>) => Option.Option<A>
} =
  <A>(p: PredicateWithIndex<A, number>) =>
  (list: List.List<A>) => {
    const listLength = length(list)
    return pipe(
      list,
      reverse,
      find((a, i) => p(a, listLength - i - 1)),
    )
  }

export const findLastIndex: {
  <A>(
    p: PredicateWithIndex<A, number>,
  ): (list: List.List<A>) => Option.Option<number>
} = p => list => {
  const listLength = length(list)
  return pipe(
    list,
    reverse,
    findIndex((a, i) => p(a, listLength - i - 1)),
  )
}

/** Is `a` an element of list by `Equivalence` instance */
export const elem: {
  <A>(Equivalence: Equivalence<A>): (a: A) => (list: List.List<A>) => boolean
} = Iterable.elem

export const every: {
  <A, B extends A>(
    p: RefinementWithIndex<A, B, number>,
  ): (list: List.List<A>) => list is List.List<B>
  <A>(p: PredicateWithIndex<A, number>): (list: List.List<A>) => boolean
} = Iterable.every as typeof every

export const exists: {
  <A>(p: PredicateWithIndex<A, number>): (list: List.List<A>) => boolean
} = Iterable.exists

/** Alias for `exists` */
export const some = exists

export const includes: {
  <A>(a: A): (list: List.List<A>) => boolean
} = Iterable.includes

/** Time complexity: O(n) */
export const concat: {
  <A>(end: List.List<A>): (start: List.List<A>) => List.List<A>
} = end => reduceRight(end, (a, out) => List.cons(a, out))

/** Time complexity: O(n) */
export const prependAllWith: {
  <A>(f: (a: A, i: number) => A): (list: List.List<A>) => List.List<A>
} = f =>
  reduceRight(List.nil(), (a, out, i) => List.cons(f(a, i), List.cons(a, out)))

/** Time complexity: O(n) */
export const prependAll: {
  <A>(a: A): (list: List.List<A>) => List.List<A>
} = flow(constant, prependAllWith)

/** Time complexity: O(n) */
export const appendAllWith: {
  <A>(f: (a: A, i: number) => A): (list: List.List<A>) => List.List<A>
} = f =>
  reduceRight(List.nil(), (a, out, i) => List.cons(a, List.cons(f(a, i), out)))

/** Time complexity: O(n) */
export const appendAll: {
  <A>(a: A): (list: List.List<A>) => List.List<A>
} = flow(constant, appendAllWith)

/** Time complexity: O(n) */
export const range: {
  (to: number): (from: number) => List.List<number>
} = to => from => {
  let out = List.cons(to)

  if (from < to) {
    for (let i = to - 1; i >= from; i--) {
      out = List.cons(i, out)
    }
  }

  if (from > to) {
    for (let i = to + 1; i <= from; i++) {
      out = List.cons(i, out)
    }
  }

  return out
}

export const takeWhile =
  <A>(p: PredicateWithIndex<A, number>) =>
  (list: List.List<A>): List.List<A> => {
    let newList = List.nil<A>()
    let i = -1
    while (true) {
      i++
      if (isNil(list)) {
        return reverse(newList)
      }
      if (!p(list.head, i)) {
        return reverse(newList)
      }
      newList = List.cons(list.head, newList)
      list = list.tail
    }
  }

export const take: {
  (n: number): <A>(list: List.List<A>) => List.List<A>
} = n => takeWhile((_, i) => i < n)

export const dropWhile =
  <A>(p: PredicateWithIndex<A, number>) =>
  (list: List.List<A>): List.List<A> => {
    let i = -1
    while (true) {
      i++
      if (isNil(list)) {
        return list
      }
      if (!p(list.head, i)) {
        return list
      }
      list = list.tail
    }
  }

export const drop: {
  (n: number): <A>(list: List.List<A>) => List.List<A>
} = n => dropWhile((_, i) => i < n)
