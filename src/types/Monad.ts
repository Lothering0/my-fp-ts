/* eslint-disable @typescript-eslint/no-explicit-any */
import { Functor, Functor2 } from "./Functor"
import { HKT, HKT2 } from "./HKT"
import { URIS, URIS2 } from "./Kind"
import {
  overloadWithPointFree,
  overloadWithPointFree2,
  overloadWithPointFreeLast2,
} from "../utils/points"
import { pipe } from "../utils/pipe"

export type DoObject<N extends string | number | symbol, A, B> = {
  readonly [K in N | keyof A]: K extends keyof A ? A[K] : B
}

interface BindPointed<URI extends URIS> {
  <A, B>(ma: HKT<URI, A>, f: (a: A) => HKT<URI, B>): HKT<URI, B>
}

interface Bind<URI extends URIS> extends BindPointed<URI> {
  <A, B>(f: (a: A) => HKT<URI, B>): (ma: HKT<URI, A>) => HKT<URI, B>
}

interface ComposePointed<URI extends URIS> {
  <A, B, C>(
    g: (b: B) => HKT<URI, C>,
    f: (a: A) => HKT<URI, B>,
    a: A,
  ): HKT<URI, C>
}

interface Compose<URI extends URIS> extends ComposePointed<URI> {
  <A, B, C>(
    g: (b: B) => HKT<URI, C>,
    f: (a: A) => HKT<URI, B>,
  ): (a: A) => HKT<URI, C>
}

interface MapToPointed<URI extends URIS> {
  <N extends string | number | symbol, A, B>(
    fa: HKT<URI, A>,
    name: Exclude<N, keyof A>,
    f: (a: A) => B,
  ): HKT<URI, DoObject<N, A, B>>
}

interface MapTo<URI extends URIS> extends MapToPointed<URI> {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    f: (a: A) => B,
  ): (fa: HKT<URI, A>) => HKT<URI, DoObject<N, A, B>>
}

interface ApplyToPointed<URI extends URIS> {
  <N extends string | number | symbol, A, B>(
    fa: HKT<URI, A>,
    name: Exclude<N, keyof A>,
    ff: HKT<URI, (a: A) => B>,
  ): HKT<URI, DoObject<N, A, B>>
}

interface ApplyTo<URI extends URIS> extends ApplyToPointed<URI> {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    ff: HKT<URI, (a: A) => B>,
  ): (fa: HKT<URI, A>) => HKT<URI, DoObject<N, A, B>>
}

interface ApplyResultToPointed<URI extends URIS> {
  <N extends string | number | symbol, A, B>(
    fa: HKT<URI, A>,
    name: Exclude<N, keyof A>,
    fb: HKT<URI, B>,
  ): HKT<URI, DoObject<N, A, B>>
}

interface ApplyResultTo<URI extends URIS> extends ApplyResultToPointed<URI> {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    fb: HKT<URI, B>,
  ): (fa: HKT<URI, A>) => HKT<URI, DoObject<N, A, B>>
}

interface BindToPointed<URI extends URIS> {
  <N extends string | number | symbol, A, B>(
    ma: HKT<URI, A>,
    name: Exclude<N, keyof A>,
    f: (a: A) => HKT<URI, B>,
  ): HKT<URI, DoObject<N, A, B>>
}

interface BindTo<URI extends URIS> extends BindToPointed<URI> {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    f: (a: A) => HKT<URI, B>,
  ): (ma: HKT<URI, A>) => HKT<URI, DoObject<N, A, B>>
}

interface TapPointed<URI extends URIS> {
  <A, _>(ma: HKT<URI, A>, f: (a: A) => HKT<URI, _>): HKT<URI, A>
}

interface Tap<URI extends URIS> extends TapPointed<URI> {
  <A, _>(f: (a: A) => HKT<URI, _>): (ma: HKT<URI, A>) => HKT<URI, A>
}

interface TapIoPointed<URI extends URIS> {
  <A, _>(ma: HKT<URI, A>, f: (a: A) => HKT<"IO", _>): HKT<URI, A>
}

interface TapIo<URI extends URIS> extends TapIoPointed<URI> {
  <A, _>(f: (a: A) => HKT<"IO", _>): (ma: HKT<URI, A>) => HKT<URI, A>
}

export interface Monad<URI extends URIS> {
  readonly _URI: URI
  readonly Do: HKT<URI, {}>
  readonly flat: <A>(mma: HKT<URI, HKT<URI, A>>) => HKT<URI, A>
  readonly bind: Bind<URI>
  readonly compose: Compose<URI>
  readonly mapTo: MapTo<URI>
  readonly applyTo: ApplyTo<URI>
  readonly applyResultTo: ApplyResultTo<URI>
  /** Alias for `applyResultTo` */
  readonly apS: Monad<URI>["applyResultTo"]
  readonly bindTo: BindTo<URI>
  readonly tap: Tap<URI>
  readonly tapIo: TapIo<URI>
}

interface CreateMonadArg<URI extends URIS> {
  readonly _URI: URI
  readonly flat: Monad<URI>["flat"]
}

export const createMonad =
  <URI extends URIS>(functor: Functor<URI>) =>
  (monad: CreateMonadArg<URI>): Monad<URI> => {
    const { of, map } = functor
    const { flat } = monad
    const Do = of ({})

    const applyResultToPointed: ApplyResultToPointed<URI> = (fa, name, fb) =>
      pipe (
        fa,
        map (a => map (fb, b => of ({ [name]: b, ...a } as any))),
        flat,
        flat,
      )
    const applyResultTo: ApplyResultTo<URI> =
      overloadWithPointFree2 (applyResultToPointed)
    const apS = applyResultTo

    const bindPointed: BindPointed<URI> = (ma, f) =>
      pipe (
        Do,
        apS ("a", ma),
        map (({ a }) => f (a)),
        flat,
      )
    const bind: Bind<URI> = overloadWithPointFree (bindPointed)

    const composePointed: ComposePointed<URI> = (g, f, a) => bind (f (a), g)
    const compose: Compose<URI> = overloadWithPointFreeLast2 (composePointed)

    const tapPointed: TapPointed<URI> = (ma, f) =>
      pipe (
        Do,
        apS ("a", ma),
        bind (({ a }) => bind (f (a), () => of (a))),
      )
    const tap: Tap<URI> = overloadWithPointFree (tapPointed)

    const tapIoPointed: TapIoPointed<URI> = (ma, f) =>
      pipe (
        Do,
        apS ("a", ma),
        bind (({ a }) => bind (of (f (a)), () => of (a))),
      )
    const tapIo: TapIo<URI> = overloadWithPointFree (tapIoPointed)

    const mapToPointed: MapToPointed<URI> = (fa, name, f) =>
      bind (fa, a =>
        of ({
          [name]: f (a),
          ...a,
        } as any),
      )
    const mapTo: MapTo<URI> = overloadWithPointFree2 (mapToPointed)

    const applyToPointed: ApplyToPointed<URI> = (fa, name, ff) =>
      pipe (
        Do,
        apS ("a", fa),
        apS ("f", ff),
        map (({ a, f }) => ({ [name]: f (a), ...a }) as any),
      )
    const applyTo: ApplyTo<URI> = overloadWithPointFree2 (applyToPointed)

    const bindToPointed: BindToPointed<URI> = (ma, name, f) =>
      bind (ma, a =>
        bind (f (a), b =>
          of ({
            [name]: b,
            ...a,
          } as any),
        ),
      )
    const bindTo: BindTo<URI> = overloadWithPointFree2 (bindToPointed)

    return {
      ...monad,
      Do,
      bind,
      compose,
      tap,
      tapIo,
      mapTo,
      applyTo,
      applyResultTo,
      apS,
      bindTo,
    }
  }

interface BindPointed2<URI extends URIS2> {
  <E, A, B>(ma: HKT2<URI, E, A>, f: (a: A) => HKT2<URI, E, B>): HKT2<URI, E, B>
}

interface Bind2<URI extends URIS2> extends BindPointed2<URI> {
  <E, A, B>(
    f: (a: A) => HKT2<URI, E, B>,
  ): (ma: HKT2<URI, E, A>) => HKT2<URI, E, B>
}

interface ComposePointed2<URI extends URIS2> {
  <E, A, B, C>(
    g: (b: B) => HKT2<URI, E, C>,
    f: (a: A) => HKT2<URI, E, B>,
    a: A,
  ): HKT2<URI, E, C>
}

interface Compose2<URI extends URIS2> extends ComposePointed2<URI> {
  <E, A, B, C>(
    g: (b: B) => HKT2<URI, E, C>,
    f: (a: A) => HKT2<URI, E, B>,
  ): (a: A) => HKT2<URI, E, C>
}

interface MapToPointed2<URI extends URIS2> {
  <N extends string | number | symbol, E, A, B>(
    fa: HKT2<URI, E, A>,
    name: Exclude<N, keyof A>,
    f: (a: A) => B,
  ): HKT2<URI, E, DoObject<N, A, B>>
}

interface MapTo2<URI extends URIS2> extends MapToPointed2<URI> {
  <N extends string | number | symbol, E, A, B>(
    name: Exclude<N, keyof A>,
    f: (a: A) => B,
  ): (fa: HKT2<URI, E, A>) => HKT2<URI, E, DoObject<N, A, B>>
}

interface ApplyToPointed2<URI extends URIS2> {
  <N extends string | number | symbol, E, A, B>(
    fa: HKT2<URI, E, A>,
    name: Exclude<N, keyof A>,
    ff: HKT2<URI, E, (a: A) => B>,
  ): HKT2<URI, E, DoObject<N, A, B>>
}

interface ApplyTo2<URI extends URIS2> extends ApplyToPointed2<URI> {
  <N extends string | number | symbol, E, A, B>(
    name: Exclude<N, keyof A>,
    ff: HKT2<URI, E, (a: A) => B>,
  ): (fa: HKT2<URI, E, A>) => HKT2<URI, E, DoObject<N, A, B>>
}

interface ApplyResultToPointed2<URI extends URIS2> {
  <N extends string | number | symbol, E, A, B>(
    fa: HKT2<URI, E, A>,
    name: Exclude<N, keyof A>,
    fb: HKT2<URI, E, B>,
  ): HKT2<URI, E, DoObject<N, A, B>>
}

interface ApplyResultTo2<URI extends URIS2> extends ApplyResultToPointed2<URI> {
  <N extends string | number | symbol, E, A, B>(
    name: Exclude<N, keyof A>,
    fb: HKT2<URI, E, B>,
  ): (fa: HKT2<URI, E, A>) => HKT2<URI, E, DoObject<N, A, B>>
}

interface BindToPointed2<URI extends URIS2> {
  <N extends string | number | symbol, E, A, B>(
    ma: HKT2<URI, E, A>,
    name: Exclude<N, keyof A>,
    f: (a: A) => HKT2<URI, E, B>,
  ): HKT2<URI, E, DoObject<N, A, B>>
}

interface BindTo2<URI extends URIS2> extends BindToPointed2<URI> {
  <N extends string | number | symbol, E, A, B>(
    name: Exclude<N, keyof A>,
    f: (a: A) => HKT2<URI, E, B>,
  ): (ma: HKT2<URI, E, A>) => HKT2<URI, E, DoObject<N, A, B>>
}

interface TapPointed2<URI extends URIS2> {
  <E, A, _>(ma: HKT2<URI, E, A>, f: (a: A) => HKT2<URI, E, _>): HKT2<URI, E, A>
}

interface Tap2<URI extends URIS2> extends TapPointed2<URI> {
  <E, A, _>(
    f: (a: A) => HKT2<URI, E, _>,
  ): (ma: HKT2<URI, E, A>) => HKT2<URI, E, A>
}

interface TapIoPointed2<URI extends URIS2> {
  <E, A, _>(ma: HKT2<URI, E, A>, f: (a: A) => HKT<"IO", _>): HKT2<URI, E, A>
}

interface TapIo2<URI extends URIS2> extends TapIoPointed2<URI> {
  <E, A, _>(f: (a: A) => HKT<"IO", _>): (ma: HKT2<URI, E, A>) => HKT2<URI, E, A>
}

export interface Monad2<URI extends URIS2> {
  readonly _URI: URI
  readonly Do: HKT2<URI, unknown, {}>
  readonly flat: <E, A>(mma: HKT2<URI, E, HKT2<URI, E, A>>) => HKT2<URI, E, A>
  readonly bind: Bind2<URI>
  readonly compose: Compose2<URI>
  readonly mapTo: MapTo2<URI>
  readonly applyTo: ApplyTo2<URI>
  readonly applyResultTo: ApplyResultTo2<URI>
  /** Alias for `applyResultTo` */
  readonly apS: Monad2<URI>["applyResultTo"]
  readonly bindTo: BindTo2<URI>
  readonly tap: Tap2<URI>
  readonly tapIo: TapIo2<URI>
}

interface CreateMonad2Arg<URI extends URIS2> {
  readonly _URI: URI
  readonly flat: Monad2<URI>["flat"]
}

type CreateMonad2 = <URI extends URIS2>(
  functor: Functor2<URI>,
) => (monad: CreateMonad2Arg<URI>) => Monad2<URI>
export const createMonad2: CreateMonad2 = createMonad as CreateMonad2
