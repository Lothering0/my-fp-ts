import { Applicative } from "../types/Applicative"
import { Functor } from "../types/Functor"
import { createMonad, Monad } from "../types/Monad"

declare module "../types/Kind" {
  interface Kind<A> {
    readonly Identity: Identity<A>
  }
}

export type Identity<A> = A

export const identity = <A>(a: A): Identity<A> => a

export const functor: Functor<"Identity"> = {
  _URI: "Identity",
  pure: identity,
  map: (fa, f) => f (fa),
}

export const { pure, map } = functor

export const applicative: Applicative<"Identity"> = {
  _URI: "Identity",
  apply: (fa, ff) => map (fa, ff),
}

export const { apply } = applicative

export const monad: Monad<"Identity"> = createMonad (functor) ({
  _URI: "Identity",
  join: identity,
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
