/* eslint-disable @typescript-eslint/no-explicit-any */
import { Sync } from "../modules/Sync"
import { Applicative } from "./Applicative"
import { DoObject } from "./DoObject"
import { HKT, Kind } from "./HKT"
import { flow, pipe } from "../utils/flow"
import { constant } from "../utils/constant"

export interface Monad<F extends HKT> extends Applicative<F> {
  readonly Do: Kind<F, unknown, unknown, {}>

  readonly flat: <R, E, A>(
    self: Kind<F, R, E, Kind<F, R, E, A>>,
  ) => Kind<F, R, E, A>

  readonly flatMap: <_, _2, A, B>(
    amb: (a: A) => Kind<F, _, _2, B>,
  ) => (self: Kind<F, _, _2, A>) => Kind<F, _, _2, B>

  readonly compose: <_, _2, A, B, C>(
    bmc: (b: B) => Kind<F, _, _2, C>,
    amb: (a: A) => Kind<F, _, _2, B>,
  ) => (a: A) => Kind<F, _, _2, C>

  readonly setTo: <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ) => <_, _2>(self: Kind<F, _, _2, A>) => Kind<F, _, _2, DoObject<N, A, B>>

  readonly mapTo: <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ) => <_, _2>(self: Kind<F, _, _2, A>) => Kind<F, _, _2, DoObject<N, A, B>>

  readonly flapTo: <N extends string | number | symbol, _, _2, A, B>(
    name: Exclude<N, keyof A>,
    fab: Kind<F, _, _2, (a: A) => B>,
  ) => (self: Kind<F, _, _2, A>) => Kind<F, _, _2, DoObject<N, A, B>>

  readonly apS: <N extends string | number | symbol, _, _2, A, B>(
    name: Exclude<N, keyof A>,
    fb: Kind<F, _, _2, B>,
  ) => (self: Kind<F, _, _2, A>) => Kind<F, _, _2, DoObject<N, A, B>>

  readonly flatMapTo: <N extends string | number | symbol, _, _2, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => Kind<F, _, _2, B>,
  ) => (self: Kind<F, _, _2, A>) => Kind<F, _, _2, DoObject<N, A, B>>

  readonly tap: <_, _2, A, _3>(
    am_: (a: A) => Kind<F, _, _2, _3>,
  ) => (self: Kind<F, _, _2, A>) => Kind<F, _, _2, A>

  readonly tapSync: <A, _>(
    am_: (a: A) => Sync<_>,
  ) => <_2, _3>(self: Kind<F, _2, _3, A>) => Kind<F, _2, _3, A>
}

export const createMonad = <F extends HKT>(
  Monad: Applicative<F> & Pick<Monad<F>, "flat">,
): Monad<F> => {
  const { of, map, flat } = Monad
  const Do = of ({})

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

  const tapSync: Monad<F>["tapSync"] =
    <A, _>(am_: (a: A) => Sync<_>) =>
    <_2, _3>(self: Kind<F, _2, _3, A>): Kind<F, _2, _3, A> =>
      pipe (
        Do,
        apS ("a", self),
        flatMap (({ a }) =>
          pipe (
            a,
            am_,
            sync => sync (), // From `Sync`
            of<_2, _3, _>,
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
