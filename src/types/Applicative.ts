import { HKT, Kind } from "./HKT"
import { Functor } from "./Functor"
import { overload } from "../utils/overloads"

export interface Applicative<F extends HKT> extends Functor<F> {
  readonly of: <_, _2, A>(a: A) => Kind<F, _, _2, A>
  readonly ap: {
    <_, _2, A, B>(
      fa: Kind<F, _, _2, A>,
    ): (self: Kind<F, _, _2, (a: A) => B>) => Kind<F, _, _2, B>
    <_, _2, A, B>(
      self: Kind<F, _, _2, (a: A) => B>,
      fa: Kind<F, _, _2, A>,
    ): Kind<F, _, _2, B>
  }
  /** Alias for `ap` */
  readonly apply: Applicative<F>["ap"]
  readonly flap: {
    <_, _2, A, B>(
      fab: Kind<F, _, _2, (a: A) => B>,
    ): (self: Kind<F, _, _2, A>) => Kind<F, _, _2, B>
    <_, _2, A, B>(
      self: Kind<F, _, _2, A>,
      fab: Kind<F, _, _2, (a: A) => B>,
    ): Kind<F, _, _2, B>
  }
  /** Alias for `flap` */
  readonly flipApply: Applicative<F>["flap"]
}

export const createApplicative = <F extends HKT>(
  applicative: Functor<F> & Pick<Applicative<F>, "of" | "ap">,
): Applicative<F> => {
  const flap: Applicative<F>["flap"] = overload (1, (self, fab) =>
    applicative.ap (fab, self),
  )

  return {
    ...applicative,
    apply: applicative.ap,
    flap,
    flipApply: flap,
  }
}
