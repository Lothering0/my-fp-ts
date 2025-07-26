import { HKT, Kind } from "./HKT"
import { Applicative } from "./Applicative"
import { FunctorWithIndex } from "./FunctorWithIndex"
import { flip } from "../utils/flip"

export interface ApplicativeWithIndex<F extends HKT, I>
  extends FunctorWithIndex<F, I>,
    Applicative<F> {
  readonly apWithIndex: <_, _2, A>(
    fa: Kind<F, _, _2, A>,
  ) => <B>(self: Kind<F, _, _2, (i: I, a: A) => B>) => Kind<F, _, _2, B>
  /** Alias for `apWithIndex` */
  readonly applyWithIndex: ApplicativeWithIndex<F, I>["apWithIndex"]
  readonly flapWithIndex: <_, _2, A, B>(
    fiab: Kind<F, _, _2, (i: I, a: A) => B>,
  ) => (self: Kind<F, _, _2, A>) => Kind<F, _, _2, B>
  /** Alias for `flapWithIndex` */
  readonly flipApplyWithIndex: ApplicativeWithIndex<F, I>["flapWithIndex"]
}

export const createApplicativeWithIndex = <F extends HKT, I>(
  Applicative: Applicative<F> &
    FunctorWithIndex<F, I> &
    Pick<ApplicativeWithIndex<F, I>, "apWithIndex">,
): ApplicativeWithIndex<F, I> => {
  const flapWithIndex: ApplicativeWithIndex<F, I>["flapWithIndex"] = flip (
    Applicative.apWithIndex,
  ) as typeof flapWithIndex

  return {
    ...Applicative,
    applyWithIndex: Applicative.apWithIndex,
    flapWithIndex,
    flipApplyWithIndex: flapWithIndex,
  }
}
