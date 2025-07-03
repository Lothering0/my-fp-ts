import * as O from "../Option"
import { overload } from "../../utils/overloads"
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

export const getOptionT = <F extends HKT>(F: Monad<F>) => {
  type TransformedHKT = OptionT<F>

  const some: {
    <_, _2, A>(a: A): Kind<TransformedHKT, _, _2, A>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = flow (O.some, F.of) as any

  const zero: {
    <_, E, A = never>(): Kind<TransformedHKT, _, E, A>
  } = () => F.of (O.none)

  const fromF: {
    <_, _2, A>(ma: Kind<F, _, _2, A>): Kind<TransformedHKT, _, _2, A>
  } = F.map (O.some)

  const match: {
    <_, _2, A, B>(
      onNone: LazyArg<B>,
      onSome: (a: A) => B,
    ): (self: Kind<TransformedHKT, _, _2, A>) => Kind<F, _, _2, B>
    <_, _2, A, B>(
      self: Kind<TransformedHKT, _, _2, A>,
      onNone: LazyArg<B>,
      onSome: (a: A) => B,
    ): Kind<F, _, _2, B>
  } = overload (2, (self, onNone, onSome) =>
    F.map (self, O.match (onNone, onSome)),
  )

  const functor: Functor<TransformedHKT> = {
    map: overload (1, (fma, f) => functor.map (fma, F.map (f))),
  }

  const applicative = createApplicative<TransformedHKT> ({
    ...functor,
    of: some,
    ap: overload (
      1,
      <_, _2, A, B>(
        fmf: Kind<TransformedHKT, _, _2, (a: A) => B>,
        fma: Kind<TransformedHKT, _, _2, A>,
      ): Kind<TransformedHKT, _, _2, B> =>
        pipe (
          fmf,
          F.map (mf => (mg: O.Option<A>) => O.ap (mf, mg)),
          F.ap (fma),
        ),
    ),
  })

  const monad = createMonad<TransformedHKT> ({
    ...applicative,
    flat: flow (F.flatMap (O.match (() => F.of (O.none), identity))),
  })

  return {
    some,
    zero,
    fromF,
    match,
    functor,
    ...functor,
    applicative,
    ...applicative,
    monad,
    ...monad,
  }
}
