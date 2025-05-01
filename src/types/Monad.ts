import { Functor, Functor2 } from "./Functor"
import { HKT, HKT2 } from "./HKT"
import { URIS, URIS2 } from "./Kind"

export interface Monad<URI extends URIS> {
  readonly _URI: URI
  readonly Do: HKT<URI, {}>
  readonly join: <A>(mma: HKT<URI, HKT<URI, A>>) => HKT<URI, A>
  readonly bind: <A, B>(
    ma: HKT<URI, A>,
    f: (a: A) => HKT<URI, B>,
  ) => HKT<URI, B>
  readonly compose: <A, B, C>(
    g: (b: B) => HKT<URI, C>,
    f: (a: A) => HKT<URI, B>,
  ) => (a: A) => HKT<URI, C>
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
  readonly applyResultTo: <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    fb: HKT<URI, B>,
  ) => (fa: HKT<URI, A>) => HKT<
    URI,
    {
      readonly [K in N | keyof A]: K extends keyof A ? A[K] : B
    }
  >
  /** Alias for `applyResultTo` */
  readonly apS: Monad<URI>["applyResultTo"]
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
  readonly returnM: <A, B>(f: (a: A) => B) => (ma: HKT<URI, A>) => HKT<URI, B>
}

export const createMonad =
  <URI extends URIS>(functor: Functor<URI>) =>
  (
    monad: Partial<Monad<URI>> & Required<Pick<Monad<URI>, "_URI" | "join">>,
  ): Monad<URI> => {
    const { pure, map } = functor
    const m: Monad<URI> = {
      Do: pure ({}),
      bind: (ma, f) => monad.join (map (ma, f)),
      compose: (g, f) => a => m.bind (f (a), g),
      mapTo: (name, f) => fa =>
        m.bind (
          fa,
          a =>
            pure ({
              [name]: f (a),
              ...a,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }) as any,
        ),
      applyTo: (name, ff) => fa =>
        m.bind (fa, a =>
          m.bind (ff, f =>
            pure ({
              [name]: f (a),
              ...a,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any),
          ),
        ),
      applyResultTo: (name, fb) => fa =>
        m.bind (fa, a =>
          m.bind (fb, b =>
            pure ({
              [name]: b,
              ...a,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any),
          ),
        ),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      apS: (...args: [any, any]) => m.applyResultTo (...args) as any,
      bindTo: (name, f) => ma =>
        m.bind (ma, a =>
          m.bind (f (a), b =>
            pure ({
              [name]: b,
              ...a,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any),
          ),
        ),
      tap: f => ma => m.bind (m.bind (ma, f), () => ma),
      tapIo: f => ma => m.bind (ma, a => m.bind (pure (f (a)), () => ma)),
      returnM: f => ma => map (ma, f),
      ...monad,
    }

    return m
  }

export interface Monad2<URI extends URIS2> {
  readonly _URI: URI
  readonly Do: HKT2<URI, unknown, {}>
  readonly join: <E, A>(mma: HKT2<URI, E, HKT2<URI, E, A>>) => HKT2<URI, E, A>
  readonly bind: <E, A, B>(
    ma: HKT2<URI, E, A>,
    f: (a: A) => HKT2<URI, E, B>,
  ) => HKT2<URI, E, B>
  readonly compose: <E, A, B, C>(
    g: (b: B) => HKT2<URI, E, C>,
    f: (a: A) => HKT2<URI, E, B>,
  ) => (a: A) => HKT2<URI, E, C>
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
  readonly applyResultTo: <N extends string | number | symbol, E, A, B>(
    name: Exclude<N, keyof A>,
    fb: HKT2<URI, E, B>,
  ) => (fa: HKT2<URI, E, A>) => HKT2<
    URI,
    E,
    {
      readonly [K in N | keyof A]: K extends keyof A ? A[K] : B
    }
  >
  /** Alias for `applyResultTo` */
  readonly apS: Monad2<URI>["applyResultTo"]
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
  readonly returnM: <E, A, B>(
    f: (a: A) => B,
  ) => (ma: HKT2<URI, E, A>) => HKT2<URI, E, B>
}

export const createMonad2 =
  <URI extends URIS2>(functor: Functor2<URI>) =>
  (
    monad: Partial<Monad2<URI>> & Required<Pick<Monad2<URI>, "_URI" | "join">>,
  ): Monad2<URI> =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createMonad (functor as Functor<any>) (monad as Monad<any>) as Monad2<URI>
