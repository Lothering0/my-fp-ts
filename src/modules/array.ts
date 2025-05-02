import { Applicative, createApplicative } from "../types/Applicative"
import { createMonad, Monad } from "../types/Monad"
import { Semigroup } from "../types/Semigroup"
import { Monoid } from "../types/Monoid"
import {
  FunctorWithIndex,
  createFunctorWithIndex,
} from "../types/FunctorWithIndex"

declare module "../types/Kind" {
  export interface Kind<A> {
    readonly Array: Array<A>
  }
}

export const functor: FunctorWithIndex<"Array"> = createFunctorWithIndex ({
  _URI: "Array",
  pure: a => [a],
  map: (fa, f) => fa.map (f),
})

export const { pure, map } = functor

export const applicative: Applicative<"Array"> = createApplicative ({
  _URI: "Array",
  apply: (fa, ff) => flat (map (ff, f => map (fa, f))),
})

export const { apply } = applicative

const monad: Monad<"Array"> = createMonad (functor) ({
  _URI: "Array",
  flat: xs => xs.flat (),
})

export const {
  Do,
  flat,
  bind,
  compose,
  mapTo,
  applyTo,
  applyResultTo,
  apS,
  bindTo,
  tap,
  tapIo,
} = monad

export const getSemigroup = <A>(): Semigroup<Array<A>> => ({
  concat: (xs, ys) => [...xs, ...ys],
})

export const getMonoid = <A>(): Monoid<Array<A>> => ({
  ...getSemigroup (),
  empty: [],
})
