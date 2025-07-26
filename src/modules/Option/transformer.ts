import * as O from "../Option"
import { HKT, Kind } from "../../types/HKT"
import { Functor } from "../../types/Functor"
import { createApplicative } from "../../types/Applicative"
import { createMonad, Monad } from "../../types/Monad"
import { flow, pipe } from "../../utils/flow"
import { identity } from "../Identity"
import { LazyArg } from "../../types/utils"

export interface OptionT<F extends HKT> extends HKT {
  readonly type: Kind<F, this["_R"], this["_E"], O.Option<this["_A"]>>
}

export const transform = <F extends HKT>(F: Monad<F>) => {
  type THKT = OptionT<F>

  const some: {
    <_, _2, A>(a: A): Kind<THKT, _, _2, A>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = flow (O.some, F.of) as any

  const zero: {
    <_, E, A = never>(): Kind<THKT, _, E, A>
  } = () => F.of (O.none)

  const fromF: {
    <_, _2, A>(ma: Kind<F, _, _2, A>): Kind<THKT, _, _2, A>
  } = F.map (O.some)

  const match: {
    <_, _2, A, B>(
      onNone: LazyArg<B>,
      onSome: (a: A) => B,
    ): (self: Kind<THKT, _, _2, A>) => Kind<F, _, _2, B>
  } = flow (O.match, F.map)

  const Functor: Functor<THKT> = {
    map: flow (O.map, F.map),
  }

  const Applicative = createApplicative<THKT> ({
    ...Functor,
    of: some,
    ap:
      <_, _2, A>(fma: Kind<THKT, _, _2, A>) =>
      <B>(self: Kind<THKT, _, _2, (a: A) => B>): Kind<THKT, _, _2, B> =>
        pipe (
          self,
          F.map (mf => (mg: O.Option<A>) => O.ap (mg) (mf)),
          F.ap (fma),
        ),
  })

  const Monad = createMonad<THKT> ({
    ...Applicative,
    flat: flow (F.flatMap (O.match (() => F.of (O.none), identity))),
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
