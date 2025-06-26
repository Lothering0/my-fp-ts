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

type ConsConstructor = <A>(head: A, tail: List<A>) => List<A>
export const cons: ConsConstructor = (head, tail) => ({
  _tag: "Cons",
  head,
  tail,
})

export const nil: List<never> = {
  _tag: "Nil",
}

type Zero = <A = never>() => List<A>
export const zero: Zero = () => nil

type IsNil = (xs: List<unknown>) => xs is Nil
export const isNil: IsNil = xs => xs._tag === "Nil"

interface MatchPointed {
  <A, B>(xs: List<A>, whenNil: LazyArg<B>, whenCons: (a: A) => B): B
}

interface MatchPointFree {
  <A, B>(whenNil: LazyArg<B>, whenCons: (a: A) => B): (xs: List<A>) => B
}

interface Match extends MatchPointed, MatchPointFree {}

const matchPointed: MatchPointed = (xs, whenNil, whenCons) =>
  isNil (xs) ? whenNil () : whenCons (xs.head)
export const match: Match = overload (2, matchPointed)

type FromArray = <A>(xs: A[]) => List<A>
export const fromArray: FromArray = A.reduceRight (nil, (x, acc) => cons (x, acc))
