/* eslint-disable @typescript-eslint/no-explicit-any */
import { Applicative, Applicative2 } from "../Applicative"
import { URIS, URIS2 } from "../Kind"
import { overload, overload2, overloadLast2 } from "../../utils/overloads"
import { pipe } from "../../utils/flow"
import { constant } from "../../utils/constant"
import { Monad, Monad2 } from "./Monad"
import { ApS, ApSPointed } from "./ApS"
import { FlatMap, FlatMapPointed } from "./FlatMap"
import { Compose, ComposePointed } from "./Compose"
import { Tap, TapPointed } from "./Tap"
import { TapIo, TapIoPointed } from "./TapIo"
import { MapTo, MapToPointed } from "./MapTo"
import { SetTo, SetToPointed } from "./SetTo"
import { ApplyTo, ApplyToPointed } from "./ApplyTo"
import { FlatMapTo, FlatMapToPointed } from "./FlatMapTo"

export const createMonad = <URI extends URIS>(
  monad: CreateMonadArg<URI>,
): Monad<URI> => {
  const { of, map, flat } = monad
  const Do = of ({})

  const apSPointed: ApSPointed<URI> = (fa, name, fb) =>
    pipe (
      fa,
      map (a => map (fb, b => ({ [name]: b, ...a }) as any)),
      flat,
    )
  const apS: ApS<URI> = overload2 (apSPointed)

  const flatMapPointed: FlatMapPointed<URI> = (ma, f) =>
    pipe (
      Do,
      apS ("a", ma),
      map (({ a }) => f (a)),
      flat,
    )
  const flatMap: FlatMap<URI> = overload (flatMapPointed)

  const composePointed: ComposePointed<URI> = (g, f, a) =>
    pipe (a, f, flatMap (g))
  const compose: Compose<URI> = overloadLast2 (composePointed)

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
  const tap: Tap<URI> = overload (tapPointed)

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
  const tapIo: TapIo<URI> = overload (tapIoPointed)

  const mapToPointed: MapToPointed<URI> = (fa, name, f) =>
    flatMap (fa, a =>
      of ({
        [name]: f (a),
        ...a,
      } as any),
    )
  const mapTo: MapTo<URI> = overload2 (mapToPointed)

  const setToPointed: SetToPointed<URI> = (fa, name, b) =>
    mapToPointed (fa, name, constant (b))
  const setTo: SetTo<URI> = overload2 (setToPointed)

  const applyToPointed: ApplyToPointed<URI> = (fa, name, ff) =>
    pipe (
      Do,
      apS ("a", fa),
      apS ("f", ff),
      map (({ a, f }) => ({ [name]: f (a), ...a }) as any),
    )
  const applyTo: ApplyTo<URI> = overload2 (applyToPointed)

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
  const flatMapTo: FlatMapTo<URI> = overload2 (flatMapToPointed)

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
