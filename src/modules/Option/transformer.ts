import * as option from "../Option"
import { Hkt, Kind } from "../../types/Hkt"
import { Functor } from "../../types/Functor"
import { createApplicative } from "../../types/Applicative"
import { createMonad, Monad } from "../../types/Monad"
import { flow, pipe } from "../../utils/flow"
import { identity } from "../Identity"
import { LazyArg } from "../../types/utils"

export type OptionT<F extends Hkt, In, Collectable, Fixed> = Kind<
  F,
  option.Option<In>,
  Collectable,
  Fixed
>

export interface OptionTHkt<F extends Hkt> extends Hkt {
  readonly type: OptionT<F, this["_in"], this["_collectable"], this["_fixed"]>
}

export const transform = <F extends Hkt>(M: Monad<F>) => {
  type THkt = OptionTHkt<F>

  const some: {
    <In, Collectable, Fixed>(a: In): Kind<THkt, In, Collectable, Fixed>
  } = flow (option.some, M.of)

  const zero: {
    <Collectable, Fixed>(): Kind<THkt, never, Collectable, Fixed>
  } = () => M.of (option.none)

  const fromKind: {
    <In, Collectable, Fixed>(
      ma: Kind<F, In, Collectable, Fixed>,
    ): Kind<THkt, In, Collectable, Fixed>
  } = M.map (option.some)

  const match: {
    <In, Out1, Collectable, Fixed, Out2 = Out1>(
      onNone: LazyArg<Out1>,
      onSome: (a: In) => Out2,
    ): (
      self: Kind<THkt, In, Collectable, Fixed>,
    ) => Kind<F, Out1 | Out2, Collectable, Fixed>
  } = flow (option.match, M.map)

  const Functor: Functor<THkt> = {
    map: flow (option.map, M.map),
  }

  const Applicative = createApplicative<THkt> ({
    ...Functor,
    of: some,
    ap:
      <In, Collectable1, Fixed>(fma: Kind<THkt, In, Collectable1, Fixed>) =>
      <Collectable2, Out>(
        self: Kind<THkt, (a: In) => Out, Collectable2, Fixed>,
      ): Kind<THkt, Out, Collectable1 | Collectable2, Fixed> =>
        pipe (
          self,
          M.map (mf => (mg: option.Option<In>) => option.ap (mg) (mf)),
          M.ap (fma),
        ),
  })

  const Monad = createMonad<THkt> ({
    ...Applicative,
    flat: M.flatMap (
      option.match (() => M.of (option.none), identity),
    ) as Monad<THkt>["flat"],
  })

  return {
    some,
    zero,
    fromKind,
    match,
    Functor,
    ...Functor,
    Applicative,
    ...Applicative,
    Monad,
    ...Monad,
  }
}
