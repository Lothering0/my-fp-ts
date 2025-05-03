import { createApplicative, Applicative } from "../types/Applicative"
import { createFunctor, Functor } from "../types/Functor"
import { createMonad, Monad } from "../types/Monad"

declare module "../types/Kind" {
  interface Kind<A> {
    readonly Identity: Identity<A>
  }
}

export type Identity<A> = A

type IdentityConstructor = <A>(a: A) => Identity<A>
export const identity: IdentityConstructor = a => a

export const functor: Functor<"Identity"> = createFunctor ({
  _URI: "Identity",
  pure: identity,
  map: (fa, f) => f (fa),
})

export const { pure, map } = functor

export const applicative: Applicative<"Identity"> = createApplicative ({
  _URI: "Identity",
  apply: map,
})

export const { apply } = applicative

export const monad: Monad<"Identity"> = createMonad (functor) ({
  _URI: "Identity",
  flat: identity,
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
