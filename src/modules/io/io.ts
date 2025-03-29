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

export const { join, bind } = monad

export const Do: IO<{}> = pure ({})

/*
// TODO: https://gcanti.github.io/fp-ts/modules/Task.ts.html#bindto
type BindTo = <N extends string | number | symbol, A, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => IO<B>,
) => (ma: IO<A>) => IO<{
  readonly [K in N | keyof A]: K extends keyof A ? A[K] : B
}>
export const bindTo: BindTo = (name, f) => ma =>
  pure ({
    [name]: fromIo (f (fromIo (ma))),
    ...fromIo (ma),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any)

type Tap = <A, _>(f: (a: A) => IO<_>) => (ma: IO<A>) => IO<A>
export const tap: Tap = f => ma => (bind (ma, f), ma) */
