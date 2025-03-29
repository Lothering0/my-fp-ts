import { Applicative, Functor, Monad } from "../types"

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

const monad: Monad<"Array"> = {
  _URI: "Array",
  join: as => as.flat (),
  bind: (as, f) => join (map (as, f)),
}

export const { bind, join } = monad

export const Do: Array<{}> = [{}]
