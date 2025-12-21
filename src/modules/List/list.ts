import { Hkt } from '../../typeclasses/Hkt'

export interface ListHkt extends Hkt {
  readonly Type: List<this['In']>
}

export type List<A> = (Nil | Cons<A>) & Iterable<A>

export interface Nil extends Iterable<never> {
  readonly _id: 'List'
  readonly _tag: 'Nil'
}

export interface Cons<A> extends Iterable<A> {
  readonly _id: 'List'
  readonly _tag: 'Cons'
  readonly head: A
  readonly tail: List<A>
}

export const nil: {
  <A = never>(): List<A>
} = () =>
  Object.freeze({
    _id: 'List',
    _tag: 'Nil',
    *[Symbol.iterator]() {},
  })

export const cons: {
  <A>(head: A, tail?: List<A>): List<A>
} = (head, tail = nil()) =>
  Object.freeze({
    _id: 'List',
    _tag: 'Cons',
    head,
    tail,
    *[Symbol.iterator]() {
      yield head
      yield* tail
    },
  })
