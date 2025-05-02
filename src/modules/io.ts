import { createApplicative, Applicative } from "../types/Applicative"
import { createFunctor, Functor } from "../types/Functor"
import { createMonad, Monad } from "../types/Monad"
import { pipe } from "../utils/pipe"

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

export const functor: Functor<"IO"> = createFunctor ({
  _URI: "IO",
  pure: io,
  map: (fa, f) => pipe (fa, fromIo, f, io),
})

export const { pure, map } = functor

export const applicative: Applicative<"IO"> = createApplicative ({
  _URI: "IO",
  apply: (fa, ff) => map (fa, fromIo (ff)),
})

export const { apply } = applicative

export const monad: Monad<"IO"> = createMonad (functor) ({
  _URI: "IO",
  flat: fromIo,
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
