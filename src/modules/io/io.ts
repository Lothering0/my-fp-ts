import { Applicative, createMonad, Functor, Monad } from "../../types"

declare module "../../types" {
  interface Kind<A> {
    readonly IO: IO<A>
  }
}

export interface IO<T> {
  readonly value: T
}

type IOConstructor = <A>(a: A) => IO<A>
export const io: IOConstructor = value => ({
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

export const { Do, join, bind, mapTo, applyTo, bindTo, tap, tapIo } = monad
