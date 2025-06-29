import { HKT, Kind } from "./HKT"
import { Applicative } from "./Applicative"
import { FunctorWithIndex } from "./FunctorWithIndex"
import { overload } from "../utils/overloads"

export interface ApplicativeWithIndex<F extends HKT, I>
  extends FunctorWithIndex<F, I>,
    Applicative<F> {
  readonly apWithIndex: {
    <_, A, B>(
      fiab: Kind<F, _, (i: I, a: A) => B>,
    ): (self: Kind<F, _, A>) => Kind<F, _, B>
    <_, A, B>(
      fiab: Kind<F, _, (i: I, a: A) => B>,
      self: Kind<F, _, A>,
    ): Kind<F, _, B>
  }
  /** Alias for `apWithIndex` */
  readonly applyWithIndex: ApplicativeWithIndex<F, I>["ap"]
  readonly flapWithIndex: {
    <_, A, B>(
      fiab: Kind<F, _, (i: I, a: A) => B>,
    ): (self: Kind<F, _, A>) => Kind<F, _, B>
    <_, A, B>(
      self: Kind<F, _, A>,
      fiab: Kind<F, _, (i: I, a: A) => B>,
    ): Kind<F, _, B>
  }
  /** Alias for `flapWithIndex` */
  readonly flipApplyWithIndex: ApplicativeWithIndex<F, I>["flapWithIndex"]
}

export const createApplicativeWithIndex = <F extends HKT, I>(
  applicative: Applicative<F> &
    FunctorWithIndex<F, I> &
    Pick<ApplicativeWithIndex<F, I>, "apWithIndex">,
): ApplicativeWithIndex<F, I> => {
  const flapWithIndex: ApplicativeWithIndex<F, I>["flapWithIndex"] = overload (
    1,
    (self, fab) => applicative.apWithIndex (fab, self),
  )

  return {
    ...applicative,
    applyWithIndex: applicative.apWithIndex,
    flapWithIndex,
    flipApplyWithIndex: flapWithIndex,
  }
}
