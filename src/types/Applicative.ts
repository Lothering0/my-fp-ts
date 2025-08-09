import { Hkt, Kind } from "./Hkt"
import { Functor } from "./Functor"
import { flip } from "../utils/flip"

export interface Applicative<F extends Hkt> extends Functor<F> {
  readonly of: <A>(a: A) => Kind<F, never, never, A>
  readonly ap: <S, E1, A>(
    fa: Kind<F, S, E1, A>,
  ) => <E2, B>(self: Kind<F, S, E2, (a: A) => B>) => Kind<F, S, E1 | E2, B>
  /** Alias for `ap` */
  readonly apply: Applicative<F>["ap"]
  readonly flap: <S, E1, A, B>(
    fab: Kind<F, S, E1, (a: A) => B>,
  ) => <E2>(self: Kind<F, S, E2, A>) => Kind<F, S, E1 | E2, B>
  /** Alias for `flap` */
  readonly flipApply: Applicative<F>["flap"]
}

export const createApplicative = <F extends Hkt>(
  Applicative: Functor<F> & Pick<Applicative<F>, "of" | "ap">,
): Applicative<F> => {
  const flap: Applicative<F>["flap"] = flip (Applicative.ap) as typeof flap

  return {
    ...Applicative,
    apply: Applicative.ap,
    flap,
    flipApply: flap,
  }
}
