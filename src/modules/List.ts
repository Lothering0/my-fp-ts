import * as array from './ReadonlyArray'
import { LazyArg } from '../types/utils'
import { pipe } from '../utils/flow'

export type List<A> = Nil | Cons<A>

export interface Nil {
  readonly _tag: 'Nil'
}

export interface Cons<A> {
  readonly _tag: 'Cons'
  readonly head: A
  readonly tail: List<A>
}

export const cons: {
  <A>(head: A, tail: List<A>): List<A>
} = (head, tail) => ({
  _tag: 'Cons',
  head,
  tail,
})

export const nil: List<never> = {
  _tag: 'Nil',
}

export const zero: {
  <A = never>(): List<A>
} = () => nil

export const isNil: {
  (xs: List<unknown>): xs is Nil
} = xs => xs._tag === 'Nil'

export interface Matchers<A, B, C = B> {
  readonly onNil: LazyArg<B>
  readonly onCons: (a: A) => C
}

export const match: {
  <A, B, C = B>(matchers: Matchers<A, B, C>): (self: List<A>) => B | C
} = matchers => self =>
  isNil(self) ? matchers.onNil() : matchers.onCons(self.head)

export const fromReadonlyArray = <A>(as: ReadonlyArray<A>): List<A> =>
  pipe(
    as,
    array.reduceRight(nil as List<A>, (x, acc) => cons(x, acc)),
  )
