/* eslint-disable @typescript-eslint/no-explicit-any */
import { Sync } from "../modules/Sync"
import { Applicative } from "./Applicative"
import { DoObject, DoObjectKey } from "./DoObject"
import { HKT, Kind } from "./HKT"
import { flow, pipe } from "../utils/flow"
import { constant } from "../utils/constant"

export interface Monad<F extends HKT> extends Applicative<F> {
  readonly Do: Kind<F, never, never, {}>

  readonly flat: <S, E1, E2, A>(
    self: Kind<F, S, E1, Kind<F, S, E2, A>>,
  ) => Kind<F, S, E1 | E2, A>

  readonly flatMap: <S, E1, A, B>(
    amb: (a: A) => Kind<F, S, E1, B>,
  ) => <E2>(self: Kind<F, S, E2, A>) => Kind<F, S, E1 | E2, B>

  readonly compose: <S, E1, E2, A, B, C>(
    bmc: (b: B) => Kind<F, S, E2, C>,
    amb: (a: A) => Kind<F, S, E1, B>,
  ) => (a: A) => Kind<F, S, E1 | E2, C>

  readonly setTo: <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ) => <S, _, _2>(self: Kind<F, S, _, A>) => Kind<F, S, _, DoObject<N, A, B>>

  readonly mapTo: <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ) => <S, _>(self: Kind<F, S, _, A>) => Kind<F, S, _, DoObject<N, A, B>>

  readonly flapTo: <N extends DoObjectKey, S, E1, A, B>(
    name: Exclude<N, keyof A>,
    fab: Kind<F, S, E1, (a: A) => B>,
  ) => <E2>(self: Kind<F, S, E2, A>) => Kind<F, S, E1 | E2, DoObject<N, A, B>>

  readonly apS: <N extends DoObjectKey, S, E1, A, B>(
    name: Exclude<N, keyof A>,
    fb: Kind<F, S, E1, B>,
  ) => <E2>(self: Kind<F, S, E2, A>) => Kind<F, S, E1 | E2, DoObject<N, A, B>>

  readonly flatMapTo: <N extends DoObjectKey, S, E1, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => Kind<F, S, E1, B>,
  ) => <E2>(self: Kind<F, S, E2, A>) => Kind<F, S, E1 | E2, DoObject<N, A, B>>

  readonly tap: <S, E1, A, _3>(
    am_: (a: A) => Kind<F, S, E1, _3>,
  ) => <E2>(self: Kind<F, S, E2, A>) => Kind<F, S, E1 | E2, A>

  readonly tapSync: <A, _>(
    am_: (a: A) => Sync<_>,
  ) => <S, _2>(self: Kind<F, S, _2, A>) => Kind<F, S, _2, A>
}

export const createMonad = <F extends HKT>(
  Monad: Applicative<F> & Pick<Monad<F>, "flat">,
): Monad<F> => {
  const { of, map, flat } = Monad
  const Do: Monad<F>["Do"] = of ({})

  const apS: Monad<F>["apS"] = (name, fb) =>
    flow (
      map (a => map (b => ({ [name]: b, ...a }) as any) (fb)),
      flat,
    )

  const flatMap: Monad<F>["flatMap"] = amb => self =>
    pipe (
      Do,
      apS ("a", self),
      map (({ a }) => amb (a)),
      flat,
    )

  const compose: Monad<F>["compose"] = (bmc, amb) => flow (amb, flatMap (bmc))

  const tap: Monad<F>["tap"] = am_ => self =>
    pipe (
      Do,
      apS ("a", self),
      flatMap (({ a }) =>
        pipe (
          a,
          am_,
          flatMap (() => of (a)),
        ),
      ),
    )

  const tapSync: Monad<F>["tapSync"] = am_ => self =>
    pipe (
      Do,
      apS ("a", self),
      flatMap (({ a }) =>
        pipe (
          a,
          am_,
          sync => sync (), // From `Sync`
          of,
          flatMap (() => of (a)),
        ),
      ),
    )

  const mapTo: Monad<F>["mapTo"] = (name, ab) =>
    flatMap (a =>
      of ({
        [name]: ab (a),
        ...a,
      } as any),
    )

  const setTo: Monad<F>["setTo"] = (name, b) => mapTo (name, constant (b))

  const flapTo: Monad<F>["flapTo"] = (name, fab) => self =>
    pipe (
      Do,
      apS ("a", self),
      apS ("ab", fab),
      map (({ a, ab }) => ({ [name]: ab (a), ...a }) as any),
    )

  const flatMapTo: Monad<F>["flatMapTo"] = (name, amb) =>
    flatMap (a =>
      pipe (
        a,
        amb,
        flatMap (b =>
          of ({
            [name]: b,
            ...a,
          } as any),
        ),
      ),
    )

  return {
    ...Monad,
    Do,
    flatMap,
    compose,
    tap,
    tapSync,
    setTo,
    mapTo,
    flapTo,
    apS,
    flatMapTo,
  }
}
