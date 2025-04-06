import { Applicative, createMonad, Functor, Monad } from "../types"

declare module "../types" {
  interface Kind<A> {
    readonly Identity: Identity<A>
  }
}

export interface Identity<A> {
  readonly _tag: "Identity"
  readonly value: A
}

type IdentityConstructor = <A>(a: A) => Identity<A>
export const identity: IdentityConstructor = value => ({
  _tag: "Identity",
  value,
})

type FromIdentity = <A>(ma: Identity<A>) => A
export const fromIdentity: FromIdentity = mma => mma.value

export const functor: Functor<"Identity"> = {
  _URI: "Identity",
  pure: identity,
  map: (fa, f) => identity (f (fromIdentity (fa))),
}

export const { pure, map } = functor

export const applicative: Applicative<"Identity"> = {
  _URI: "Identity",
  apply: (fa, ff) => map (fa, fromIdentity (ff)),
}

export const { apply } = applicative

export const monad: Monad<"Identity"> = createMonad (functor) ({
  _URI: "Identity",
  join: fromIdentity,
})

export const { Do, join, bind, mapTo, applyTo, bindTo, tap, tapIo } = monad
