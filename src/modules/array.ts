import { Applicative } from "../types/Applicative"
import { Functor } from "../types/Functor"
import { createMonad, Monad } from "../types/Monad"
import { Semigroup } from "../types/Semigroup"
import { Monoid } from "../types/Monoid"

declare module "../types/Kind" {
  export interface Kind<A> {
    readonly Array: Array<A>
  }
}

export const functor: Functor<"Array"> = {
  _URI: "Array",
  pure: a => [a],
  map: (fa, f) => fa.map (f),
}

export const { pure, map } = functor

export const applicative: Applicative<"Array"> = {
  _URI: "Array",
  apply: (fa, ff) => join (map (ff, f => map (fa, f))),
}

export const { apply } = applicative

const monad: Monad<"Array"> = createMonad (functor) ({
  _URI: "Array",
  join: xs => xs.flat (),
})

export const {
  Do,
  join,
  bind,
  compose,
  mapTo,
  applyTo,
  applyResultTo,
  apS,
  bindTo,
  tap,
  tapIo,
  returnM,
} = monad

export const getSemigroup = <A>(): Semigroup<Array<A>> => ({
  concat: (xs, ys) => [...xs, ...ys],
})

export const getMonoid = <A>(): Monoid<Array<A>> => ({
  ...getSemigroup (),
  empty: [],
})
