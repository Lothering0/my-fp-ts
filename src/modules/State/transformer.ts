import * as S from "../State"
import { HKT, Kind } from "../../types/HKT"
import { Functor } from "../../types/Functor"
import { createApplicative } from "../../types/Applicative"
import { createMonad, Monad } from "../../types/Monad"
import { pipe } from "../../utils/flow"
import { overload } from "../../utils/overloads"

export interface StateT<F extends HKT> extends HKT {
  readonly type: (
    s: this["_R"],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => Kind<F, any, this["_E"], [this["_A"], this["_R"]]>
}

export const transform = <F extends HKT>(F: Monad<F>) => {
  type THKT = StateT<F>

  const fromState: {
    <S, E, A>(self: S.State<S, A>): Kind<THKT, S, E, A>
  } = self => s => F.of (S.run (s) (self))

  const fromF: {
    <S, R, E, A>(self: Kind<F, R, E, A>): Kind<THKT, S, E, A>
  } = self => s => F.map (self, a => [a, s])

  const run: {
    <S>(s: S): <R, E, A>(ma: Kind<THKT, S, E, A>) => Kind<F, R, E, [A, S]>
  } = s => ma => ma (s)

  const evaluate: {
    <S>(s: S): <R, E, A>(ma: Kind<THKT, S, E, A>) => Kind<F, R, E, A>
  } = s => ma => F.map (run (s) (ma), ([a]) => a)

  const execute: {
    <S>(s: S): <R, E, A>(ma: Kind<THKT, S, E, A>) => Kind<F, R, E, S>
  } = s => ma => F.map (run (s) (ma), ([, s]) => s)

  const functor: Functor<THKT> = {
    map: overload (1, (self, f) => s => F.map (self (s), ([a, s]) => [f (a), s])),
  }

  const applicative = createApplicative<THKT> ({
    ...functor,
    of: a => s => F.of ([a, s]),
    ap: overload (
      1,
      (self, fa) => s =>
        pipe (
          self,
          functor.map (f => functor.map (fa, f)),
          run (s),
          F.flatMap (([mb, s]) => run (s) (mb)),
        ),
    ),
  })

  const monad = createMonad<THKT> ({
    ...applicative,
    flat: self => s => F.flatMap (run (s) (self), ([mb, s]) => run (s) (mb)),
  })

  return {
    fromState,
    fromF,
    run,
    evaluate,
    execute,
    functor,
    ...functor,
    applicative,
    ...applicative,
    monad,
    ...monad,
  }
}
