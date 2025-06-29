import { HKT, Kind } from "./HKT"
import { Functor } from "./Functor"
import { overload } from "../utils/overloads"

export interface Applicative<F extends HKT> extends Functor<F> {
  readonly of: <_, A>(a: A) => Kind<F, _, A>
  readonly ap: {
    <_, A, B>(
      fa: Kind<F, _, A>,
    ): (self: Kind<F, _, (a: A) => B>) => Kind<F, _, B>
    <_, A, B>(self: Kind<F, _, (a: A) => B>, fa: Kind<F, _, A>): Kind<F, _, B>
  }
  /** Alias for `ap` */
  readonly apply: Applicative<F>["ap"]
  readonly flap: {
    <_, A, B>(
      fab: Kind<F, _, (a: A) => B>,
    ): (self: Kind<F, _, A>) => Kind<F, _, B>
    <_, A, B>(self: Kind<F, _, A>, fab: Kind<F, _, (a: A) => B>): Kind<F, _, B>
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
