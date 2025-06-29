/* eslint-disable @typescript-eslint/no-explicit-any */
import { Io } from "../modules/Io"
import { Applicative } from "./Applicative"
import { DoObject } from "./DoObject"
import { HKT, Kind } from "./HKT"
import { pipe } from "../utils/flow"
import { overload, overloadLast } from "../utils/overloads"
import { constant } from "../utils/constant"

export interface Monad<F extends HKT> extends Applicative<F> {
  readonly Do: Kind<F, unknown, {}>

  readonly flat: <E, A>(mma: Kind<F, E, Kind<F, E, A>>) => Kind<F, E, A>

  readonly flatMap: {
    <_, A, B>(
      amb: (a: A) => Kind<F, _, B>,
    ): (self: Kind<F, _, A>) => Kind<F, _, B>
    <_, A, B>(self: Kind<F, _, A>, amb: (a: A) => Kind<F, _, B>): Kind<F, _, B>
  }

  readonly compose: {
    <_, A, B, C>(
      bmc: (b: B) => Kind<F, _, C>,
      amb: (a: A) => Kind<F, _, B>,
    ): (a: A) => Kind<F, _, C>
    <_, A, B, C>(
      bmc: (b: B) => Kind<F, _, C>,
      amb: (a: A) => Kind<F, _, B>,
      a: A,
    ): Kind<F, _, C>
  }

  readonly setTo: {
    <N extends string | number | symbol, _, A, B>(
      name: Exclude<N, keyof A>,
      b: B,
    ): (self: Kind<F, _, A>) => Kind<F, _, DoObject<N, A, B>>
    <N extends string | number | symbol, _, A, B>(
      self: Kind<F, _, A>,
      name: Exclude<N, keyof A>,
      b: B,
    ): Kind<F, _, DoObject<N, A, B>>
  }

  readonly mapTo: {
    <N extends string | number | symbol, _, A, B>(
      name: Exclude<N, keyof A>,
      ab: (a: A) => B,
    ): (self: Kind<F, _, A>) => Kind<F, _, DoObject<N, A, B>>
    <N extends string | number | symbol, _, A, B>(
      self: Kind<F, _, A>,
      name: Exclude<N, keyof A>,
      ab: (a: A) => B,
    ): Kind<F, _, DoObject<N, A, B>>
  }

  readonly applyTo: {
    <N extends string | number | symbol, _, A, B>(
      name: Exclude<N, keyof A>,
      fab: Kind<F, _, (a: A) => B>,
    ): (self: Kind<F, _, A>) => Kind<F, _, DoObject<N, A, B>>
    <N extends string | number | symbol, _, A, B>(
      self: Kind<F, _, A>,
      name: Exclude<N, keyof A>,
      fab: Kind<F, _, (a: A) => B>,
    ): Kind<F, _, DoObject<N, A, B>>
  }

  readonly apS: {
    <N extends string | number | symbol, _, A, B>(
      name: Exclude<N, keyof A>,
      fb: Kind<F, _, B>,
    ): (self: Kind<F, _, A>) => Kind<F, _, DoObject<N, A, B>>
    <N extends string | number | symbol, _, A, B>(
      self: Kind<F, _, A>,
      name: Exclude<N, keyof A>,
      fb: Kind<F, _, B>,
    ): Kind<F, _, DoObject<N, A, B>>
  }

  readonly flatMapTo: {
    <N extends string | number | symbol, _, A, B>(
      name: Exclude<N, keyof A>,
      amb: (a: A) => Kind<F, _, B>,
    ): (self: Kind<F, _, A>) => Kind<F, _, DoObject<N, A, B>>
    <N extends string | number | symbol, _, A, B>(
      self: Kind<F, _, A>,
      name: Exclude<N, keyof A>,
      amb: (a: A) => Kind<F, _, B>,
    ): Kind<F, _, DoObject<N, A, B>>
  }

  readonly tap: {
    <_, A, _2>(
      am_: (a: A) => Kind<F, _, _2>,
    ): (self: Kind<F, _, A>) => Kind<F, _, A>
    <_, A, _2>(
      self: Kind<F, _, A>,
      am_: (a: A) => Kind<F, _, _2>,
    ): Kind<F, _, A>
  }

  readonly tapIo: {
    <_, A, _2>(am_: (a: A) => Io<_2>): (self: Kind<F, _, A>) => Kind<F, _, A>
    <_, A, _2>(self: Kind<F, _, A>, am_: (a: A) => Io<_2>): Kind<F, _, A>
  }
}

export const createMonad = <F extends HKT>(
  monad: Applicative<F> & Pick<Monad<F>, "flat">,
): Monad<F> => {
  const { of, map, flat } = monad
  const Do = of ({})

  const apS: Monad<F>["apS"] = overload (
    2,
    <N extends string | number | symbol, _, A, B>(
      self: Kind<F, _, A>,
      name: Exclude<N, keyof A>,
      fb: Kind<F, _, B>,
    ): Kind<F, _, DoObject<N, A, B>> =>
      pipe (
        self,
        map (a => map (fb, b => ({ [name]: b, ...a }) as any)),
        flat,
      ),
  )

  const flatMap: Monad<F>["flatMap"] = overload (
    1,
    <_, A, B>(
      self: Kind<F, _, A>,
      amb: (a: A) => Kind<F, _, B>,
    ): Kind<F, _, B> =>
      pipe (
        Do,
        apS ("a", self),
        map (({ a }) => amb (a)),
        flat,
      ),
  )

  const compose: Monad<F>["compose"] = overloadLast (
    2,
    <_, A, B, C>(
      bmc: (b: B) => Kind<F, _, C>,
      amb: (a: A) => Kind<F, _, B>,
      a: A,
    ): Kind<F, _, C> => pipe (a, amb, flatMap (bmc)),
  )

  const tap: Monad<F>["tap"] = overload (
    1,
    <_, A, _2>(
      self: Kind<F, _, A>,
      am_: (a: A) => Kind<F, _, _2>,
    ): Kind<F, _, A> =>
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

  const tapIo: Monad<F>["tapIo"] = overload (
    1,
    <_, A, _2>(self: Kind<F, _, A>, am_: (a: A) => Io<_2>): Kind<F, _, A> =>
      pipe (
        Do,
        apS ("a", self),
        flatMap (({ a }) =>
          pipe (
            a,
            am_,
            io => io (), // From IO
            of<_, _2>,
            flatMap (() => of (a)),
          ),
        ),
      ),
  )

  const mapTo: Monad<F>["mapTo"] = overload (
    2,
    <N extends string | number | symbol, _, A, B>(
      self: Kind<F, _, A>,
      name: Exclude<N, keyof A>,
      ab: (a: A) => B,
    ): Kind<F, _, DoObject<N, A, B>> =>
      flatMap (self, a =>
        of ({
          [name]: ab (a),
          ...a,
        } as any),
      ),
  )

  const setTo: Monad<F>["setTo"] = overload (
    2,
    <N extends string | number | symbol, _, A, B>(
      self: Kind<F, _, A>,
      name: Exclude<N, keyof A>,
      b: B,
    ): Kind<F, _, DoObject<N, A, B>> => mapTo (self, name, constant (b)),
  )

  const applyTo: Monad<F>["applyTo"] = overload (
    2,
    <N extends string | number | symbol, _, A, B>(
      self: Kind<F, _, A>,
      name: Exclude<N, keyof A>,
      fab: Kind<F, _, (a: A) => B>,
    ): Kind<F, _, DoObject<N, A, B>> =>
      pipe (
        Do,
        apS ("a", self),
        apS ("ab", fab),
        map (({ a, ab }) => ({ [name]: ab (a), ...a }) as any),
      ),
  )

  const flatMapTo: Monad<F>["flatMapTo"] = overload (
    2,
    <N extends string | number | symbol, _, A, B>(
      self: Kind<F, _, A>,
      name: Exclude<N, keyof A>,
      amb: (a: A) => Kind<F, _, B>,
    ): Kind<F, _, DoObject<N, A, B>> =>
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
