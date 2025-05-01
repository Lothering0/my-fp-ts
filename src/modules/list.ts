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
const list: ListEliminator = (xs, whenNil, whenCons) =>
  isNil (xs) ? whenNil () : whenCons (xs.head)

type FromArray = <A>(xs: Array<A>) => List<A>
const fromArray: FromArray = xs => xs.reduceRight ((acc, x) => cons (x, acc), nil)

/* type FromArrayLazy = <A>(xs: Array<A>) => () => List<A>
const fromArrayLazy: FromArrayLazy = xs => () =>
  xs.length ? cons (xs[0]!, fromArrayLazy (xs.slice (1))) : nil */

const myList = cons (5, cons (3, cons (4, nil)))
const myList2 = fromArray ([1, 2, 3])
