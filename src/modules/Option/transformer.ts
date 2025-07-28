import * as option from "../Option"
import { HKT, Kind } from "../../types/HKT"
import { Functor } from "../../types/Functor"
import { createApplicative } from "../../types/Applicative"
import { createMonad, Monad } from "../../types/Monad"
import { flow, pipe } from "../../utils/flow"
import { identity } from "../Identity"
import { LazyArg } from "../../types/utils"

export interface OptionT<F extends HKT> extends HKT {
  readonly type: Kind<F, this["_R"], this["_E"], option.Option<this["_A"]>>
}

export const transform = <F extends HKT>(M: Monad<F>) => {
  type THKT = OptionT<F>

  const some: {
    <_, _2, A>(a: A): Kind<THKT, _, _2, A>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = flow (option.some, M.of) as any

  const zero: {
    <_, E, A = never>(): Kind<THKT, _, E, A>
  } = () => M.of (option.none)

  const fromF: {
    <_, _2, A>(ma: Kind<F, _, _2, A>): Kind<THKT, _, _2, A>
  } = M.map (option.some)

  const match: {
    <_, _2, A, B, C = B>(
      onNone: LazyArg<B>,
      onSome: (a: A) => C,
    ): (self: Kind<THKT, _, _2, A>) => Kind<F, _, _2, B | C>
  } = flow (option.match, M.map)

  const Functor: Functor<THKT> = {
    map: flow (option.map, M.map),
  }

  const Applicative = createApplicative<THKT> ({
    ...Functor,
    of: some,
    ap:
      <_, _2, A>(fma: Kind<THKT, _, _2, A>) =>
      <B>(self: Kind<THKT, _, _2, (a: A) => B>): Kind<THKT, _, _2, B> =>
        pipe (
          self,
          M.map (mf => (mg: option.Option<A>) => option.ap (mg) (mf)),
          M.ap (fma),
        ),
  })

  const Monad = createMonad<THKT> ({
    ...Applicative,
    flat: flow (M.flatMap (option.match (() => M.of (option.none), identity))),
  })

  return {
    some,
    zero,
    fromF,
    match,
    Functor,
    ...Functor,
    Applicative,
    ...Applicative,
    Monad,
    ...Monad,
  }
}
