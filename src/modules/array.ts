import {
  Applicative,
  createMonad,
  Functor,
  Monad,
  Monoid,
  Semigroup,
} from "../types"

declare module "../types" {
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
  join: as => as.flat (),
})

export const { Do, bind, join, mapTo, applyTo, bindTo, tap, tapIo } = monad

export const getSemigroup = <A>(): Semigroup<Array<A>> => ({
  concat: (xs, ys) => [...xs, ...ys],
})

export const getMonoid = <A>(): Monoid<Array<A>> => ({
  ...getSemigroup (),
  empty: [],
})
