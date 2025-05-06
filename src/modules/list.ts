type List<A> = Nil | Cons<A>

interface Nil {
  readonly _tag: "Nil"
}

interface Cons<A> {
  readonly _tag: "Cons"
  readonly head: A
  readonly tail: List<A>
}

const nil: List<never> = {
  _tag: "Nil",
}

type ConsConstructor = <A>(head: A, tail: List<A>) => List<A>
const cons: ConsConstructor = (head, tail) => ({
  _tag: "Cons",
  head,
  tail,
})

type IsNil = (xs: List<unknown>) => xs is Nil
const isNil: IsNil = xs => xs._tag === "Nil"

type ListEliminator = <A, B>(
  xs: List<A>,
  whenNil: () => B,
  whenCons: (a: A) => B,
) => B
export const list: ListEliminator = (xs, whenNil, whenCons) =>
  isNil (xs) ? whenNil () : whenCons (xs.head)

type FromArray = <A>(xs: Array<A>) => List<A>
export const fromArray: FromArray = xs =>
  xs.reduceRight ((acc, x) => cons (x, acc), nil)
