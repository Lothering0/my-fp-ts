import * as A from "./Array"
import { LazyArg } from "../types/utils"
import { overload } from "../utils/overloads"

export type List<A> = Nil | Cons<A>

export interface Nil {
  readonly _tag: "Nil"
}

export interface Cons<A> {
  readonly _tag: "Cons"
  readonly head: A
  readonly tail: List<A>
}

export const cons: {
  <A>(head: A, tail: List<A>): List<A>
} = (head, tail) => ({
  _tag: "Cons",
  head,
  tail,
})

export const nil: List<never> = {
  _tag: "Nil",
}

export const zero: {
  <A = never>(): List<A>
} = () => nil

export const isNil: {
  (xs: List<unknown>): xs is Nil
} = xs => xs._tag === "Nil"

export const match: {
  <A, B>(whenNil: LazyArg<B>, whenCons: (a: A) => B): (xs: List<A>) => B
  <A, B>(xs: List<A>, whenNil: LazyArg<B>, whenCons: (a: A) => B): B
} = overload (2, (xs, whenNil, whenCons) =>
  isNil (xs) ? whenNil () : whenCons (xs.head),
)

export const fromArray: {
  <A>(xs: A[]): List<A>
} = A.reduceRight (nil, (x, acc) => cons (x, acc))
