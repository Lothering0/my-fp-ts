import { Cons, List, nil } from './list'

export const _internal = Symbol('List.internal')

export interface _ListInternal<A> {
  last?: Cons<A>
}

export const _nil: List<never> = Object.freeze({
  _id: 'List',
  _tag: 'Nil',
  length: 0,
  [_internal]: {},
  *[Symbol.iterator]() {},
})

export const _cons = <A>(
  head: A,
  tail: List<A> = nil(),
  length?: number,
): Cons<A> => {
  const lastNodeOfTail = tail[_internal].last
  const isTailNil = tail._tag === 'Nil'
  length ??= isTailNil ? 1 : tail.length + 1
  const list: List<A> = Object.freeze({
    _id: 'List',
    _tag: 'Cons',
    length,
    head,
    get tail() {
      if (length <= 1 || isTailNil) {
        return _nil
      }
      const newList = _cons(tail.head, tail.tail, length - 1)
      newList[_internal].last = this[_internal].last
      return newList
    },
    [_internal]: {},
    *[Symbol.iterator]() {
      yield head
      if (length > 1) {
        yield* this.tail
      }
    },
  })
  list[_internal].last = lastNodeOfTail ?? list
  return list
}
