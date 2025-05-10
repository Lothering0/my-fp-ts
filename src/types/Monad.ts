/* eslint-disable @typescript-eslint/no-explicit-any */
import { Applicative, Applicative2 } from "./Applicative"
import { HKT, HKT2 } from "./HKT"
import { URIS, URIS2 } from "./Kind"
import {
  overloadWithPointFree,
  overloadWithPointFree2,
  overloadWithPointFreeLast2,
} from "../utils/points"
import { pipe } from "../utils/flow"
import { constant } from "../utils/constant"

export interface Monad<URI extends URIS> extends Applicative<URI> {
  readonly Do: HKT<URI, {}>
  readonly flat: <A>(mma: HKT<URI, HKT<URI, A>>) => HKT<URI, A>
  readonly flatMap: FlatMap<URI>
  readonly compose: Compose<URI>
  readonly setTo: SetTo<URI>
  readonly mapTo: MapTo<URI>
  readonly applyTo: ApplyTo<URI>
  readonly applyResultTo: ApplyResultTo<URI>
  /** Alias for `applyResultTo` */
  readonly apS: Monad<URI>["applyResultTo"]
  readonly flatMapTo: FlatMapTo<URI>
  readonly tap: Tap<URI>
  readonly tapIo: TapIo<URI>
}

export interface Monad2<URI extends URIS2> extends Applicative2<URI> {
  readonly Do: HKT2<URI, unknown, {}>
  readonly flat: <E, A>(mma: HKT2<URI, E, HKT2<URI, E, A>>) => HKT2<URI, E, A>
  readonly flatMap: FlatMap2<URI>
  readonly compose: Compose2<URI>
  readonly setTo: SetTo2<URI>
  readonly mapTo: MapTo2<URI>
  readonly applyTo: ApplyTo2<URI>
  readonly applyResultTo: ApplyResultTo2<URI>
  /** Alias for `applyResultTo` */
  readonly apS: Monad2<URI>["applyResultTo"]
  readonly flatMapTo: FlatMapTo2<URI>
  readonly tap: Tap2<URI>
  readonly tapIo: TapIo2<URI>
}

export type DoObject<N extends string | number | symbol, A, B> = {
  readonly [K in N | keyof A]: K extends keyof A ? A[K] : B
}

export const createMonad = <URI extends URIS>(
  monad: CreateMonadArg<URI>,
): Monad<URI> => {
  const { of, apply, flat } = monad
  const Do = of ({})

  const applyResultToPointed: ApplyResultToPointed<URI> = (fa, name, fb) =>
    pipe (
      fa,
      apply (
        of (a =>
          apply (
            fb,
            of (b => ({ [name]: b, ...a }) as any),
          ),
        ),
      ),
      flat,
    )
  const applyResultTo: ApplyResultTo<URI> =
    overloadWithPointFree2 (applyResultToPointed)
  const apS = applyResultTo

  const flatMapPointed: FlatMapPointed<URI> = (ma, f) =>
    pipe (Do, apS ("a", ma), apply (of (({ a }) => f (a))), flat)
  const flatMap: FlatMap<URI> = overloadWithPointFree (flatMapPointed)

  const composePointed: ComposePointed<URI> = (g, f, a) =>
    pipe (a, f, flatMap (g))
  const compose: Compose<URI> = overloadWithPointFreeLast2 (composePointed)

  const tapPointed: TapPointed<URI> = (ma, f) =>
    pipe (
      Do,
      apS ("a", ma),
      flatMap (({ a }) =>
        pipe (
          a,
          f,
          flatMap (() => of (a)),
        ),
      ),
    )
  const tap: Tap<URI> = overloadWithPointFree (tapPointed)

  const tapIoPointed: TapIoPointed<URI> = (ma, f) =>
    pipe (
      Do,
      apS ("a", ma),
      flatMap (({ a }) =>
        pipe (
          a,
          f,
          f => f (), // From IO
          of,
          flatMap (() => of (a)),
        ),
      ),
    )
  const tapIo: TapIo<URI> = overloadWithPointFree (tapIoPointed)

  const mapToPointed: MapToPointed<URI> = (fa, name, f) =>
    flatMap (fa, a =>
      of ({
        [name]: f (a),
        ...a,
      } as any),
    )
  const mapTo: MapTo<URI> = overloadWithPointFree2 (mapToPointed)

  const setToPointed: SetToPointed<URI> = (fa, name, b) =>
    mapToPointed (fa, name, constant (b))
  const setTo: SetTo<URI> = overloadWithPointFree2 (setToPointed)

  const applyToPointed: ApplyToPointed<URI> = (fa, name, ff) =>
    pipe (
      Do,
      apS ("a", fa),
      apS ("f", ff),
      apply (of (({ a, f }) => ({ [name]: f (a), ...a }) as any)),
    )
  const applyTo: ApplyTo<URI> = overloadWithPointFree2 (applyToPointed)

  const flatMapToPointed: FlatMapToPointed<URI> = (ma, name, f) =>
    flatMap (ma, a =>
      pipe (
        a,
        f,
        flatMap (b =>
          of ({
            [name]: b,
            ...a,
          } as any),
        ),
      ),
    )
  const flatMapTo: FlatMapTo<URI> = overloadWithPointFree2 (flatMapToPointed)

  return {
    ...monad,
    Do,
    flatMap,
    compose,
    tap,
    tapIo,
    setTo,
    mapTo,
    applyTo,
    applyResultTo,
    apS,
    flatMapTo,
  }
}

type CreateMonad2 = <URI extends URIS2>(
  monad: CreateMonadArg2<URI>,
) => Monad2<URI>
export const createMonad2: CreateMonad2 = createMonad as CreateMonad2

interface CreateMonadArg<URI extends URIS> extends Applicative<URI> {
  readonly flat: Monad<URI>["flat"]
}

interface CreateMonadArg2<URI extends URIS2> extends Applicative2<URI> {
  readonly flat: Monad2<URI>["flat"]
}

interface FlatMapPointed<URI extends URIS> {
  <A, B>(ma: HKT<URI, A>, f: (a: A) => HKT<URI, B>): HKT<URI, B>
}

interface FlatMapPointed2<URI extends URIS2> {
  <_, A, B>(ma: HKT2<URI, _, A>, f: (a: A) => HKT2<URI, _, B>): HKT2<URI, _, B>
}

interface FlatMap<URI extends URIS> extends FlatMapPointed<URI> {
  <A, B>(f: (a: A) => HKT<URI, B>): (ma: HKT<URI, A>) => HKT<URI, B>
}

interface FlatMap2<URI extends URIS2> extends FlatMapPointed2<URI> {
  <_, A, B>(
    f: (a: A) => HKT2<URI, _, B>,
  ): (ma: HKT2<URI, _, A>) => HKT2<URI, _, B>
}

interface ComposePointed<URI extends URIS> {
  <A, B, C>(
    g: (b: B) => HKT<URI, C>,
    f: (a: A) => HKT<URI, B>,
    a: A,
  ): HKT<URI, C>
}

interface ComposePointed2<URI extends URIS2> {
  <_, A, B, C>(
    g: (b: B) => HKT2<URI, _, C>,
    f: (a: A) => HKT2<URI, _, B>,
    a: A,
  ): HKT2<URI, _, C>
}

interface Compose<URI extends URIS> extends ComposePointed<URI> {
  <A, B, C>(
    g: (b: B) => HKT<URI, C>,
    f: (a: A) => HKT<URI, B>,
  ): (a: A) => HKT<URI, C>
}

interface Compose2<URI extends URIS2> extends ComposePointed2<URI> {
  <_, A, B, C>(
    g: (b: B) => HKT2<URI, _, C>,
    f: (a: A) => HKT2<URI, _, B>,
  ): (a: A) => HKT2<URI, _, C>
}

interface SetToPointed<URI extends URIS> {
  <N extends string | number | symbol, A, B>(
    fa: HKT<URI, A>,
    name: Exclude<N, keyof A>,
    b: B,
  ): HKT<URI, DoObject<N, A, B>>
}

interface SetToPointed2<URI extends URIS2> {
  <N extends string | number | symbol, _, A, B>(
    fa: HKT2<URI, _, A>,
    name: Exclude<N, keyof A>,
    b: B,
  ): HKT2<URI, _, DoObject<N, A, B>>
}

interface SetTo<URI extends URIS> extends SetToPointed<URI> {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): (fa: HKT<URI, A>) => HKT<URI, DoObject<N, A, B>>
}

interface SetTo2<URI extends URIS2> extends SetToPointed2<URI> {
  <N extends string | number | symbol, _, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): (fa: HKT2<URI, _, A>) => HKT2<URI, _, DoObject<N, A, B>>
}

interface MapToPointed<URI extends URIS> {
  <N extends string | number | symbol, A, B>(
    fa: HKT<URI, A>,
    name: Exclude<N, keyof A>,
    f: (a: A) => B,
  ): HKT<URI, DoObject<N, A, B>>
}

interface MapToPointed2<URI extends URIS2> {
  <N extends string | number | symbol, _, A, B>(
    fa: HKT2<URI, _, A>,
    name: Exclude<N, keyof A>,
    f: (a: A) => B,
  ): HKT2<URI, _, DoObject<N, A, B>>
}

interface MapTo<URI extends URIS> extends MapToPointed<URI> {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    f: (a: A) => B,
  ): (fa: HKT<URI, A>) => HKT<URI, DoObject<N, A, B>>
}

interface MapTo2<URI extends URIS2> extends MapToPointed2<URI> {
  <N extends string | number | symbol, _, A, B>(
    name: Exclude<N, keyof A>,
    f: (a: A) => B,
  ): (fa: HKT2<URI, _, A>) => HKT2<URI, _, DoObject<N, A, B>>
}

interface ApplyToPointed<URI extends URIS> {
  <N extends string | number | symbol, A, B>(
    fa: HKT<URI, A>,
    name: Exclude<N, keyof A>,
    ff: HKT<URI, (a: A) => B>,
  ): HKT<URI, DoObject<N, A, B>>
}

interface ApplyToPointed2<URI extends URIS2> {
  <N extends string | number | symbol, _, A, B>(
    fa: HKT2<URI, _, A>,
    name: Exclude<N, keyof A>,
    ff: HKT2<URI, _, (a: A) => B>,
  ): HKT2<URI, _, DoObject<N, A, B>>
}

interface ApplyTo<URI extends URIS> extends ApplyToPointed<URI> {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    ff: HKT<URI, (a: A) => B>,
  ): (fa: HKT<URI, A>) => HKT<URI, DoObject<N, A, B>>
}

interface ApplyTo2<URI extends URIS2> extends ApplyToPointed2<URI> {
  <N extends string | number | symbol, _, A, B>(
    name: Exclude<N, keyof A>,
    ff: HKT2<URI, _, (a: A) => B>,
  ): (fa: HKT2<URI, _, A>) => HKT2<URI, _, DoObject<N, A, B>>
}

interface ApplyResultToPointed<URI extends URIS> {
  <N extends string | number | symbol, A, B>(
    fa: HKT<URI, A>,
    name: Exclude<N, keyof A>,
    fb: HKT<URI, B>,
  ): HKT<URI, DoObject<N, A, B>>
}

interface ApplyResultToPointed2<URI extends URIS2> {
  <N extends string | number | symbol, _, A, B>(
    fa: HKT2<URI, _, A>,
    name: Exclude<N, keyof A>,
    fb: HKT2<URI, _, B>,
  ): HKT2<URI, _, DoObject<N, A, B>>
}

interface ApplyResultTo<URI extends URIS> extends ApplyResultToPointed<URI> {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    fb: HKT<URI, B>,
  ): (fa: HKT<URI, A>) => HKT<URI, DoObject<N, A, B>>
}

interface ApplyResultTo2<URI extends URIS2> extends ApplyResultToPointed2<URI> {
  <N extends string | number | symbol, _, A, B>(
    name: Exclude<N, keyof A>,
    fb: HKT2<URI, _, B>,
  ): (fa: HKT2<URI, _, A>) => HKT2<URI, _, DoObject<N, A, B>>
}

interface FlatMapToPointed<URI extends URIS> {
  <N extends string | number | symbol, A, B>(
    ma: HKT<URI, A>,
    name: Exclude<N, keyof A>,
    f: (a: A) => HKT<URI, B>,
  ): HKT<URI, DoObject<N, A, B>>
}

interface FlatMapToPointed2<URI extends URIS2> {
  <N extends string | number | symbol, _, A, B>(
    ma: HKT2<URI, _, A>,
    name: Exclude<N, keyof A>,
    f: (a: A) => HKT2<URI, _, B>,
  ): HKT2<URI, _, DoObject<N, A, B>>
}

interface FlatMapTo<URI extends URIS> extends FlatMapToPointed<URI> {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    f: (a: A) => HKT<URI, B>,
  ): (ma: HKT<URI, A>) => HKT<URI, DoObject<N, A, B>>
}

interface FlatMapTo2<URI extends URIS2> extends FlatMapToPointed2<URI> {
  <N extends string | number | symbol, _, A, B>(
    name: Exclude<N, keyof A>,
    f: (a: A) => HKT2<URI, _, B>,
  ): (ma: HKT2<URI, _, A>) => HKT2<URI, _, DoObject<N, A, B>>
}

interface TapPointed<URI extends URIS> {
  <A, _>(ma: HKT<URI, A>, f: (a: A) => HKT<URI, _>): HKT<URI, A>
}

interface TapPointed2<URI extends URIS2> {
  <_, A, _2>(
    ma: HKT2<URI, _, A>,
    f: (a: A) => HKT2<URI, _, _2>,
  ): HKT2<URI, _, A>
}

interface Tap<URI extends URIS> extends TapPointed<URI> {
  <A, _>(f: (a: A) => HKT<URI, _>): (ma: HKT<URI, A>) => HKT<URI, A>
}

interface Tap2<URI extends URIS2> extends TapPointed2<URI> {
  <_, A, _2>(
    f: (a: A) => HKT2<URI, _, _2>,
  ): (ma: HKT2<URI, _, A>) => HKT2<URI, _, A>
}

interface TapIoPointed<URI extends URIS> {
  <A, _>(ma: HKT<URI, A>, f: (a: A) => HKT<"IO", _>): HKT<URI, A>
}

interface TapIoPointed2<URI extends URIS2> {
  <_, A, _2>(ma: HKT2<URI, _, A>, f: (a: A) => HKT<"IO", _2>): HKT2<URI, _, A>
}

interface TapIo<URI extends URIS> extends TapIoPointed<URI> {
  <A, _>(f: (a: A) => HKT<"IO", _>): (ma: HKT<URI, A>) => HKT<URI, A>
}

interface TapIo2<URI extends URIS2> extends TapIoPointed2<URI> {
  <_, A, _2>(
    f: (a: A) => HKT<"IO", _2>,
  ): (ma: HKT2<URI, _, A>) => HKT2<URI, _, A>
}
