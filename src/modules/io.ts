import { Applicative } from "../types/Applicative"
import { Functor } from "../types/Functor"
import { createMonad, Monad } from "../types/Monad"

declare module "../types/Kind" {
  interface Kind<A> {
    readonly IO: IO<A>
  }
}

export interface IO<T> {
  readonly _tag: "IO"
  readonly value: T
}

type IOConstructor = <A>(a: A) => IO<A>
export const io: IOConstructor = value => ({
  _tag: "IO",
  value,
})

type FromIO = <A>(ma: IO<A>) => A
export const fromIo: FromIO = mma => mma.value

export const functor: Functor<"IO"> = {
  _URI: "IO",
  pure: io,
  map: (fa, f) => io (f (fromIo (fa))),
}

export const { pure, map } = functor

export const applicative: Applicative<"IO"> = {
  _URI: "IO",
  apply: (fa, ff) => map (fa, fromIo (ff)),
}

export const { apply } = applicative

export const monad: Monad<"IO"> = createMonad (functor) ({
  _URI: "IO",
  join: fromIo,
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
