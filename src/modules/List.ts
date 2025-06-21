import { LazyArg } from "../types/utils"

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

type Match = <A, B>(
  xs: List<A>,
  whenNil: LazyArg<B>,
  whenCons: (a: A) => B,
) => B
export const match: Match = (xs, whenNil, whenCons) =>
  isNil (xs) ? whenNil () : whenCons (xs.head)

type FromArray = <A>(xs: Array<A>) => List<A>
export const fromArray: FromArray = xs =>
  xs.reduceRight ((acc, x) => cons (x, acc), nil)
