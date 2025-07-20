/* eslint-disable @typescript-eslint/no-explicit-any */
import { Sync } from "../modules/Sync"
import { Applicative } from "./Applicative"
import { DoObject } from "./DoObject"
import { HKT, Kind } from "./HKT"
import { pipe } from "../utils/flow"
import { overload, overloadLast } from "../utils/overloads"
import { constant } from "../utils/constant"

export interface Monad<F extends HKT> extends Applicative<F> {
  readonly Do: Kind<F, unknown, unknown, {}>

  readonly flat: <R, E, A>(
    self: Kind<F, R, E, Kind<F, R, E, A>>,
  ) => Kind<F, R, E, A>

  readonly flatMap: {
    <_, _2, A, B>(
      amb: (a: A) => Kind<F, _, _2, B>,
    ): (self: Kind<F, _, _2, A>) => Kind<F, _, _2, B>
    <_, _2, A, B>(
      self: Kind<F, _, _2, A>,
      amb: (a: A) => Kind<F, _, _2, B>,
    ): Kind<F, _, _2, B>
  }

  readonly compose: {
    <_, _2, A, B, C>(
      bmc: (b: B) => Kind<F, _, _2, C>,
      amb: (a: A) => Kind<F, _, _2, B>,
    ): (a: A) => Kind<F, _, _2, C>
    <_, _2, A, B, C>(
      bmc: (b: B) => Kind<F, _, _2, C>,
      amb: (a: A) => Kind<F, _, _2, B>,
      a: A,
    ): Kind<F, _, _2, C>
  }

  readonly setTo: {
    <N extends string | number | symbol, _, _2, A, B>(
      name: Exclude<N, keyof A>,
      b: B,
    ): (self: Kind<F, _, _2, A>) => Kind<F, _, _2, DoObject<N, A, B>>
    <N extends string | number | symbol, _, _2, A, B>(
      self: Kind<F, _, _2, A>,
      name: Exclude<N, keyof A>,
      b: B,
    ): Kind<F, _, _2, DoObject<N, A, B>>
  }

  readonly mapTo: {
    <N extends string | number | symbol, _, _2, A, B>(
      name: Exclude<N, keyof A>,
      ab: (a: A) => B,
    ): (self: Kind<F, _, _2, A>) => Kind<F, _, _2, DoObject<N, A, B>>
    <N extends string | number | symbol, _, _2, A, B>(
      self: Kind<F, _, _2, A>,
      name: Exclude<N, keyof A>,
      ab: (a: A) => B,
    ): Kind<F, _, _2, DoObject<N, A, B>>
  }

  readonly flapTo: {
    <N extends string | number | symbol, _, _2, A, B>(
      name: Exclude<N, keyof A>,
      fab: Kind<F, _, _2, (a: A) => B>,
    ): (self: Kind<F, _, _2, A>) => Kind<F, _, _2, DoObject<N, A, B>>
    <N extends string | number | symbol, _, _2, A, B>(
      self: Kind<F, _, _2, A>,
      name: Exclude<N, keyof A>,
      fab: Kind<F, _, _2, (a: A) => B>,
    ): Kind<F, _, _2, DoObject<N, A, B>>
  }

  readonly apS: {
    <N extends string | number | symbol, _, _2, A, B>(
      name: Exclude<N, keyof A>,
      fb: Kind<F, _, _2, B>,
    ): (self: Kind<F, _, _2, A>) => Kind<F, _, _2, DoObject<N, A, B>>
    <N extends string | number | symbol, _, _2, A, B>(
      self: Kind<F, _, _2, A>,
      name: Exclude<N, keyof A>,
      fb: Kind<F, _, _2, B>,
    ): Kind<F, _, _2, DoObject<N, A, B>>
  }

  readonly flatMapTo: {
    <N extends string | number | symbol, _, _2, A, B>(
      name: Exclude<N, keyof A>,
      amb: (a: A) => Kind<F, _, _2, B>,
    ): (self: Kind<F, _, _2, A>) => Kind<F, _, _2, DoObject<N, A, B>>
    <N extends string | number | symbol, _, _2, A, B>(
      self: Kind<F, _, _2, A>,
      name: Exclude<N, keyof A>,
      amb: (a: A) => Kind<F, _, _2, B>,
    ): Kind<F, _, _2, DoObject<N, A, B>>
  }

  readonly tap: {
    <_, _2, A, _3>(
      am_: (a: A) => Kind<F, _, _2, _3>,
    ): (self: Kind<F, _, _2, A>) => Kind<F, _, _2, A>
    <_, _2, A, _3>(
      self: Kind<F, _, _2, A>,
      am_: (a: A) => Kind<F, _, _2, _3>,
    ): Kind<F, _, _2, A>
  }

  readonly tapSync: {
    <_, _2, A, _3>(
      am_: (a: A) => Sync<_3>,
    ): (self: Kind<F, _, _2, A>) => Kind<F, _, _2, A>
    <_, _2, A, _3>(
      self: Kind<F, _, _2, A>,
      am_: (a: A) => Sync<_3>,
    ): Kind<F, _, _2, A>
  }
}

export const createMonad = <F extends HKT>(
  Monad: Applicative<F> & Pick<Monad<F>, "flat">,
): Monad<F> => {
  const { of, map, flat } = Monad
  const Do = of ({})

  const apS: Monad<F>["apS"] = overload (
    2,
    <N extends string | number | symbol, _, _2, A, B>(
      self: Kind<F, _, _2, A>,
      name: Exclude<N, keyof A>,
      fb: Kind<F, _, _2, B>,
    ): Kind<F, _, _2, DoObject<N, A, B>> =>
      pipe (
        self,
        map (a => map (fb, b => ({ [name]: b, ...a }) as any)),
        flat,
      ),
  )

  const flatMap: Monad<F>["flatMap"] = overload (
    1,
    <_, _2, A, B>(
      self: Kind<F, _, _2, A>,
      amb: (a: A) => Kind<F, _, _2, B>,
    ): Kind<F, _, _2, B> =>
      pipe (
        Do,
        apS ("a", self),
        map (({ a }) => amb (a)),
        flat,
      ),
  )

  const compose: Monad<F>["compose"] = overloadLast (
    2,
    <_, _2, A, B, C>(
      bmc: (b: B) => Kind<F, _, _2, C>,
      amb: (a: A) => Kind<F, _, _2, B>,
      a: A,
    ): Kind<F, _, _2, C> => pipe (a, amb, flatMap (bmc)),
  )

  const tap: Monad<F>["tap"] = overload (
    1,
    <_, _2, A, _3>(
      self: Kind<F, _, _2, A>,
      am_: (a: A) => Kind<F, _, _2, _3>,
    ): Kind<F, _, _2, A> =>
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
      ),
  )

  const tapSync: Monad<F>["tapSync"] = overload (
    1,
    <_, _2, A, _3>(
      self: Kind<F, _, _2, A>,
      am_: (a: A) => Sync<_3>,
    ): Kind<F, _, _2, A> =>
      pipe (
        Do,
        apS ("a", self),
        flatMap (({ a }) =>
          pipe (
            a,
            am_,
            sync => sync (), // From `Sync`
            of<_, _2, _3>,
            flatMap (() => of (a)),
          ),
        ),
      ),
  )

  const mapTo: Monad<F>["mapTo"] = overload (
    2,
    <N extends string | number | symbol, _, _2, A, B>(
      self: Kind<F, _, _2, A>,
      name: Exclude<N, keyof A>,
      ab: (a: A) => B,
    ): Kind<F, _, _2, DoObject<N, A, B>> =>
      flatMap (self, a =>
        of ({
          [name]: ab (a),
          ...a,
        } as any),
      ),
  )

  const setTo: Monad<F>["setTo"] = overload (
    2,
    <N extends string | number | symbol, _, _2, A, B>(
      self: Kind<F, _, _2, A>,
      name: Exclude<N, keyof A>,
      b: B,
    ): Kind<F, _, _2, DoObject<N, A, B>> => mapTo (self, name, constant (b)),
  )

  const flapTo: Monad<F>["flapTo"] = overload (
    2,
    <N extends string | number | symbol, _, _2, A, B>(
      self: Kind<F, _, _2, A>,
      name: Exclude<N, keyof A>,
      fab: Kind<F, _, _2, (a: A) => B>,
    ): Kind<F, _, _2, DoObject<N, A, B>> =>
      pipe (
        Do,
        apS ("a", self),
        apS ("ab", fab),
        map (({ a, ab }) => ({ [name]: ab (a), ...a }) as any),
      ),
  )

  const flatMapTo: Monad<F>["flatMapTo"] = overload (
    2,
    <N extends string | number | symbol, _, _2, A, B>(
      self: Kind<F, _, _2, A>,
      name: Exclude<N, keyof A>,
      amb: (a: A) => Kind<F, _, _2, B>,
    ): Kind<F, _, _2, DoObject<N, A, B>> =>
      flatMap (self, a =>
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
