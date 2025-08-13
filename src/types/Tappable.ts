import { Sync } from "../modules/Sync"
import { pipe } from "../utils/flow"
import { Hkt, Kind } from "./Hkt"
import { Monad } from "./Monad"
import { TypeClass } from "./TypeClass"

export interface Tappable<F extends Hkt> extends TypeClass<F> {
  readonly tap: <S, E1, A>(
    f: (a: A) => Kind<F, S, E1, unknown>,
  ) => <E2>(self: Kind<F, S, E2, A>) => Kind<F, S, E1 | E2, A>

  readonly tapSync: <A>(
    f: (a: A) => Sync<unknown>,
  ) => <S, E>(self: Kind<F, S, E, A>) => Kind<F, S, E, A>
}

export const createTappable: {
  <F extends Hkt>(Monad: Monad<F>): Tappable<F>
} = Monad => ({
  tap: f => self =>
    pipe (
      Monad.Do,
      Monad.apS ("a", self),
      Monad.flatMap (({ a }) =>
        pipe (
          a,
          f,
          Monad.flatMap (() => Monad.of (a)),
        ),
      ),
    ),
  tapSync: f => self =>
    pipe (
      Monad.Do,
      Monad.apS ("a", self),
      Monad.flatMap (({ a }) =>
        pipe (
          a,
          f,
          sync => sync (), // From `Sync`
          Monad.of,
          Monad.flatMap (() => Monad.of (a)),
        ),
      ),
    ),
})
