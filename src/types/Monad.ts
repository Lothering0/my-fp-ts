import { Functor, Functor2 } from "./Functor"
import { HKT, HKT2 } from "./HKT"
import { URIS, URIS2 } from "./Kind"
import { compose } from "../utils"

export interface Monad<URI extends URIS> {
  readonly _URI: URI
  readonly Do: HKT<URI, {}>
  readonly join: <A>(mma: HKT<URI, HKT<URI, A>>) => HKT<URI, A>
  readonly bind: <A, B>(
    ma: HKT<URI, A>,
    f: (a: A) => HKT<URI, B>,
  ) => HKT<URI, B>
  readonly mapTo: <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    f: (a: A) => B,
  ) => (fa: HKT<URI, A>) => HKT<
    URI,
    {
      readonly [K in N | keyof A]: K extends keyof A ? A[K] : B
    }
  >
  readonly applyTo: <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    ff: HKT<URI, (a: A) => B>,
  ) => (fa: HKT<URI, A>) => HKT<
    URI,
    {
      readonly [K in N | keyof A]: K extends keyof A ? A[K] : B
    }
  >
  readonly bindTo: <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    f: (a: A) => HKT<URI, B>,
  ) => (ma: HKT<URI, A>) => HKT<
    URI,
    {
      readonly [K in N | keyof A]: K extends keyof A ? A[K] : B
    }
  >
  readonly tap: <A, _>(
    f: (a: A) => HKT<URI, _>,
  ) => (ma: HKT<URI, A>) => HKT<URI, A>
  readonly tapIo: <A, _>(
    f: (a: A) => HKT<"IO", _>,
  ) => (ma: HKT<URI, A>) => HKT<URI, A>
}

export const createMonad =
  <URI extends URIS>(functor: Functor<URI>) =>
  (
    monad: Partial<Monad<URI>> & Required<Pick<Monad<URI>, "_URI" | "join">>,
  ): Monad<URI> => {
    const result: Monad<URI> = {
      Do: functor.pure ({}),
      bind: (ma, f) => monad.join (functor.map (ma, f)),
      mapTo: (name, f) => fa =>
        result.bind (fa, a =>
          result.bind (functor.map (fa, f), b =>
            functor.pure ({
              [name]: b,
              ...a,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any),
          ),
        ),
      applyTo: (name, ff) => fa =>
        result.bind (fa, a =>
          result.bind (ff, f =>
            functor.pure ({
              [name]: f (a),
              ...a,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any),
          ),
        ),
      bindTo: (name, f) => ma =>
        result.bind (ma, a =>
          result.bind (f (a), b =>
            functor.pure ({
              [name]: b,
              ...a,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any),
          ),
        ),
      tap: f => ma => result.bind (result.bind (ma, f), () => ma),
      tapIo: f => ma => (result.bind (ma, compose (functor.pure, f)), ma),
      ...monad,
    }

    return result
  }

export interface Monad2<URI extends URIS2> {
  readonly _URI: URI
  readonly Do: HKT2<URI, unknown, {}>
  readonly join: <E, A>(mma: HKT2<URI, E, HKT2<URI, E, A>>) => HKT2<URI, E, A>
  readonly bind: <E, A, B>(
    ma: HKT2<URI, E, A>,
    f: (a: A) => HKT2<URI, E, B>,
  ) => HKT2<URI, E, B>
  readonly mapTo: <N extends string | number | symbol, E, A, B>(
    name: Exclude<N, keyof A>,
    f: (a: A) => B,
  ) => (fa: HKT2<URI, E, A>) => HKT2<
    URI,
    E,
    {
      readonly [K in N | keyof A]: K extends keyof A ? A[K] : B
    }
  >
  readonly applyTo: <N extends string | number | symbol, E, A, B>(
    name: Exclude<N, keyof A>,
    ff: HKT2<URI, E, (a: A) => B>,
  ) => (fa: HKT2<URI, E, A>) => HKT2<
    URI,
    E,
    {
      readonly [K in N | keyof A]: K extends keyof A ? A[K] : B
    }
  >
  readonly bindTo: <N extends string | number | symbol, E, A, B>(
    name: Exclude<N, keyof A>,
    f: (a: A) => HKT2<URI, E, B>,
  ) => (ma: HKT2<URI, E, A>) => HKT2<
    URI,
    E,
    {
      readonly [K in N | keyof A]: K extends keyof A ? A[K] : B
    }
  >
  readonly tap: <E, A, _>(
    f: (a: A) => HKT2<URI, E, _>,
  ) => (ma: HKT2<URI, E, A>) => HKT2<URI, E, A>
  readonly tapIo: <E, A, _>(
    f: (a: A) => HKT<"IO", _>,
  ) => (ma: HKT2<URI, E, A>) => HKT2<URI, E, A>
}

export const createMonad2 =
  <URI extends URIS2>(functor: Functor2<URI>) =>
  (
    monad: Partial<Monad2<URI>> & Required<Pick<Monad2<URI>, "_URI" | "join">>,
  ): Monad2<URI> =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createMonad (functor as Functor<any>) (monad as Monad<any>) as Monad2<URI>
