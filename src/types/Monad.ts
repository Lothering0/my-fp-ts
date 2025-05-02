/* eslint-disable @typescript-eslint/no-explicit-any */
import { Functor, Functor2 } from "./Functor"
import { HKT, HKT2 } from "./HKT"
import { URIS, URIS2 } from "./Kind"
import {
  overloadWithPointFree,
  overloadWithPointFree2,
  overloadWithPointFreeLast2,
} from "../utils/points"

type DoObject<N extends string | number | symbol, A, B> = {
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

interface MonadPointed<URI extends URIS>
  extends Pick<Monad<URI>, "_URI" | "Do" | "flat"> {
  readonly bind: BindPointed<URI>
  readonly compose: ComposePointed<URI>
  readonly mapTo: MapToPointed<URI>
  readonly applyTo: ApplyToPointed<URI>
  readonly applyResultTo: ApplyResultToPointed<URI>
  readonly bindTo: BindToPointed<URI>
  readonly tap: TapPointed<URI>
  readonly tapIo: TapIoPointed<URI>
}

type CreateMonadFromPointed = <URI extends URIS>(
  monadPointed: MonadPointed<URI>,
) => Monad<URI>
const createMonadFromPointed: CreateMonadFromPointed = monadPointed => ({
  ...monadPointed,
  bind: overloadWithPointFree (monadPointed.bind),
  compose: overloadWithPointFreeLast2 (monadPointed.compose),
  mapTo: overloadWithPointFree2 (monadPointed.mapTo),
  applyTo: overloadWithPointFree2 (monadPointed.applyTo),
  applyResultTo: overloadWithPointFree2 (monadPointed.applyResultTo),
  apS: overloadWithPointFree2 (monadPointed.applyResultTo),
  bindTo: overloadWithPointFree2 (monadPointed.bindTo),
  tap: overloadWithPointFree (monadPointed.tap),
  tapIo: overloadWithPointFree (monadPointed.tapIo),
})

export const createMonad =
  <URI extends URIS>(functor: Functor<URI>) =>
  (
    monad: Partial<MonadPointed<URI>> &
      Required<Pick<Monad<URI>, "_URI" | "flat">>,
  ): Monad<URI> => {
    const { pure, map } = functor
    const m: MonadPointed<URI> = {
      Do: pure ({}),
      bind: (ma, f) => monad.flat (map (ma, f)),
      compose: (g, f, a) => m.bind (f (a), g),
      mapTo: (fa, name, f) =>
        m.bind (
          fa,
          a =>
            pure ({
              [name]: f (a),
              ...a,
            }) as any,
        ),
      applyTo: (fa, name, ff) =>
        m.bind (fa, a =>
          m.bind (ff, f =>
            pure ({
              [name]: f (a),
              ...a,
            } as any),
          ),
        ),
      applyResultTo: (fa, name, fb) =>
        m.bind (fa, a =>
          m.bind (fb, b =>
            pure ({
              [name]: b,
              ...a,
            } as any),
          ),
        ),
      bindTo: (ma, name, f) =>
        m.bind (ma, a =>
          m.bind (f (a), b =>
            pure ({
              [name]: b,
              ...a,
            } as any),
          ),
        ),
      tap: (ma, f) => m.bind (m.bind (ma, f), () => ma),
      tapIo: (ma, f) => m.bind (ma, a => m.bind (pure (f (a)), () => ma)),
      ...monad,
    }

    return createMonadFromPointed (m)
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

interface MonadPointed2<URI extends URIS2>
  extends Pick<Monad2<URI>, "_URI" | "Do" | "flat"> {
  readonly bind: BindPointed2<URI>
  readonly compose: ComposePointed2<URI>
  readonly mapTo: MapToPointed2<URI>
  readonly applyTo: ApplyToPointed2<URI>
  readonly applyResultTo: ApplyResultToPointed2<URI>
  readonly bindTo: BindToPointed2<URI>
  readonly tap: TapPointed2<URI>
  readonly tapIo: TapIoPointed2<URI>
}

type CreateMonad2 = <URI extends URIS2>(
  functor: Functor2<URI>,
) => (
  monad: Partial<MonadPointed2<URI>> &
    Required<Pick<Monad2<URI>, "_URI" | "flat">>,
) => Monad2<URI>
export const createMonad2: CreateMonad2 = createMonad as CreateMonad2
