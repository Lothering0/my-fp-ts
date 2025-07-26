import { HKT, Kind } from "./HKT"
import { Functor } from "./Functor"
import { flip } from "../utils/flip"

export interface Applicative<F extends HKT> extends Functor<F> {
  readonly of: <_, _2, A>(a: A) => Kind<F, _, _2, A>
  readonly ap: <_, _2, A>(
    fa: Kind<F, _, _2, A>,
  ) => <B>(self: Kind<F, _, _2, (a: A) => B>) => Kind<F, _, _2, B>
  /** Alias for `ap` */
  readonly apply: Applicative<F>["ap"]
  readonly flap: <_, _2, A, B>(
    fab: Kind<F, _, _2, (a: A) => B>,
  ) => (self: Kind<F, _, _2, A>) => Kind<F, _, _2, B>
  /** Alias for `flap` */
  readonly flipApply: Applicative<F>["flap"]
}

export const createApplicative = <F extends HKT>(
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
