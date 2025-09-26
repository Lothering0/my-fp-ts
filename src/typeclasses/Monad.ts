/* eslint-disable @typescript-eslint/no-explicit-any */
import { Applicative } from "./Applicative"
import { DoObject, DoObjectKey } from "../types/DoObject"
import { Hkt, Kind } from "./Hkt"
import { flow, pipe } from "../utils/flow"
import { constant } from "../utils/constant"

export interface Monad<F extends Hkt> extends Applicative<F> {
  readonly Do: Kind<F, {}>

  readonly flat: <In, Collectable1, Collectable2, Fixed>(
    self: Kind<F, Kind<F, In, Collectable2, Fixed>, Collectable1, Fixed>,
  ) => Kind<F, In, Collectable1 | Collectable2, Fixed>

  readonly flatMap: <In, Out, Collectable1, Fixed>(
    amb: (a: In) => Kind<F, Out, Collectable1, Fixed>,
  ) => <Collectable2>(
    self: Kind<F, In, Collectable2, Fixed>,
  ) => Kind<F, Out, Collectable1 | Collectable2, Fixed>

  readonly compose: <In, Out1, Out2, Collectable1, Collectable2, Fixed>(
    bmc: (b: Out1) => Kind<F, Out2, Collectable2, Fixed>,
    amb: (a: In) => Kind<F, Out1, Collectable1, Fixed>,
  ) => (a: In) => Kind<F, Out2, Collectable1 | Collectable2, Fixed>

  readonly setTo: <N extends DoObjectKey, In, Out>(
    name: Exclude<N, keyof In>,
    b: Out,
  ) => <Collectable, Fixed>(
    self: Kind<F, In, Collectable, Fixed>,
  ) => Kind<F, DoObject<N, In, Out>, Collectable, Fixed>

  readonly mapTo: <N extends DoObjectKey, In, Out>(
    name: Exclude<N, keyof In>,
    ab: (a: In) => Out,
  ) => <Collectable, Fixed>(
    self: Kind<F, In, Collectable, Fixed>,
  ) => Kind<F, DoObject<N, In, Out>, Collectable, Fixed>

  readonly flapTo: <N extends DoObjectKey, In, Out, Collectable1, Fixed>(
    name: Exclude<N, keyof In>,
    fab: Kind<F, (a: In) => Out, Collectable1, Fixed>,
  ) => <Collectable2>(
    self: Kind<F, In, Collectable2, Fixed>,
  ) => Kind<F, DoObject<N, In, Out>, Collectable1 | Collectable2, Fixed>

  readonly apS: <N extends DoObjectKey, In, Out, Collectable1, Fixed>(
    name: Exclude<N, keyof In>,
    fb: Kind<F, Out, Collectable1, Fixed>,
  ) => <Collectable2>(
    self: Kind<F, In, Collectable2, Fixed>,
  ) => Kind<F, DoObject<N, In, Out>, Collectable1 | Collectable2, Fixed>

  readonly flatMapTo: <N extends DoObjectKey, In, Out, Collectable1, Fixed>(
    name: Exclude<N, keyof In>,
    amb: (a: In) => Kind<F, Out, Collectable1, Fixed>,
  ) => <Collectable2>(
    self: Kind<F, In, Collectable2, Fixed>,
  ) => Kind<F, DoObject<N, In, Out>, Collectable1 | Collectable2, Fixed>
}

export const create = <F extends Hkt>(
  Applicative: Applicative<F>,
  Monad: Pick<Monad<F>, "flat">,
): Monad<F> => {
  const { of, map } = Applicative
  const { flat } = Monad
  const Do: Monad<F>["Do"] = of ({})

  const apS: Monad<F>["apS"] = (name, fb) =>
    flow (
      map (a => map (b => ({ [name]: b, ...a }) as any) (fb)),
      flat,
    )

  const flatMap: Monad<F>["flatMap"] = amb => flow (map (amb), flat)

  const compose: Monad<F>["compose"] = (bmc, amb) => flow (amb, flatMap (bmc))

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
    ...Applicative,
    ...Monad,
    Do,
    flatMap,
    compose,
    setTo,
    mapTo,
    flapTo,
    apS,
    flatMapTo,
  }
}
