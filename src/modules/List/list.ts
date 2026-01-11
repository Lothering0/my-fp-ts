import { Hkt } from '../../typeclasses/Hkt'
import { _cons, _nil, ListInternal } from './_internal'

export interface ListHkt extends Hkt {
  readonly Type: List<this['In']>
}

export type List<A> = (Nil | Cons<A>) & Iterable<A>

export interface Nil extends Iterable<never> {
  readonly _id: 'List'
  readonly _tag: 'Nil'
  readonly length: number
  readonly _internal: ListInternal<never>
}

export interface Cons<A> extends Iterable<A> {
  readonly _id: 'List'
  readonly _tag: 'Cons'
  readonly length: number
  readonly head: A
  readonly tail: List<A>
  readonly _internal: ListInternal<A>
}

export const nil: {
  <A = never>(): List<A>
} = () => _nil

export const cons = <A>(head: A, tail: List<A> = nil()): List<A> =>
  _cons(head, tail)
