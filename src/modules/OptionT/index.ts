import * as O from "../Option"
import { overload } from "../../utils/overloads"
import { Functor } from "../../types/Functor"
import { HKT, Kind } from "../../types/HKT"
import { createMonad, Monad } from "../../types/Monad"
import { createApplicative } from "../../types/Applicative"
import { flow, pipe } from "../../utils/flow"
import { identity } from "../Identity"
import { LazyArg } from "../../types/utils"

export interface OptionT<F extends HKT> extends HKT {
  readonly type: Kind<F, this["_E"], O.Option<this["_A"]>>
}

export const getOptionT = <F extends HKT>(F: Monad<F>) => {
  type TransformedHKT = OptionT<F>

  const some: {
    <_, A>(a: A): Kind<TransformedHKT, _, A>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = flow (O.some, F.of) as any

  const zero: {
    <E, A = never>(): Kind<TransformedHKT, E, A>
  } = () => F.of (O.none)

  const fromF: {
    <_, A>(ma: Kind<F, _, A>): Kind<TransformedHKT, _, A>
  } = F.map (O.some)

  const match: {
    <_, A, B>(
      onNone: LazyArg<B>,
      onSome: (a: A) => B,
    ): (self: Kind<TransformedHKT, _, A>) => Kind<F, _, B>
    <_, A, B>(
      self: Kind<TransformedHKT, _, A>,
      onNone: LazyArg<B>,
      onSome: (a: A) => B,
    ): Kind<F, _, B>
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
      <_, A, B>(
        fmf: Kind<TransformedHKT, _, (a: A) => B>,
        fma: Kind<TransformedHKT, _, A>,
      ): Kind<TransformedHKT, _, B> =>
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
