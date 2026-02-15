import { Hkt as Hkt_ } from '../../typeclasses/Hkt'
import { Pipeable } from '../../utils/flow'
import { NonEmptyIterable } from '../_internal'
import { _cons, _nil, ListInternal } from './_internal'

export interface Hkt extends Hkt_ {
  readonly Type: List<this['In']>
}

export interface NonEmptyHkt extends Hkt {
  readonly Type: NonEmpty<this['In']>
}

export type List<A> = (Nil | Cons<A>) & Iterable<A>

export type NonEmpty<A> = Cons<A>

export interface Nil extends Iterable<never>, Pipeable {
  readonly _id: 'List'
  readonly _tag: 'Nil'
  readonly length: number
  readonly _internal: ListInternal<never>
}

export interface Cons<A> extends NonEmptyIterable<A>, Pipeable {
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

export type Infer<F extends List<any>> = F extends List<infer A> ? A : never

export type With<F extends List<any>, A = Infer<F>> =
  F extends NonEmpty<any> ? NonEmpty<A> : List<A>

export type OrNonEmpty<
  F extends List<any>,
  G extends List<any>,
  A = Infer<F> | Infer<G>,
> =
  F extends NonEmpty<any>
    ? NonEmpty<A>
    : G extends NonEmpty<any>
      ? NonEmpty<A>
      : List<A>

export type AndNonEmpty<
  F extends List<any>,
  G extends List<any>,
  A = Infer<F> | Infer<G>,
> =
  F extends NonEmpty<any>
    ? G extends NonEmpty<any>
      ? NonEmpty<A>
      : List<A>
    : List<A>
