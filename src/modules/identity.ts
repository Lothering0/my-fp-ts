import { Applicative, Functor, Monad } from "../types"

declare module "../types" {
  interface Kind<A> {
    readonly Identity: Identity<A>
  }
}

export interface Identity<A> {
  readonly value: A
}

type IdentityConstructor = <A>(a: A) => Identity<A>
export const identity: IdentityConstructor = value => ({
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

export const monad: Monad<"Identity"> = {
  _URI: "Identity",
  join: fromIdentity,
  bind: (ma, f) => f (fromIdentity (ma)),
}

export const { join, bind } = monad

export const Do: Identity<{}> = identity ({})
