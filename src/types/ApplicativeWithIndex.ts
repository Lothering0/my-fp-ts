import { Hkt, Kind } from "./Hkt"
import { Applicative } from "./Applicative"
import { FunctorWithIndex } from "./FunctorWithIndex"
import { flip } from "../utils/flip"

export interface ApplicativeWithIndex<F extends Hkt, I>
  extends FunctorWithIndex<F, I>,
    Applicative<F> {
  readonly apWithIndex: <S, E1, A>(
    fa: Kind<F, S, E1, A>,
  ) => <E2, B>(
    self: Kind<F, S, E2, (a: A, i: I) => B>,
  ) => Kind<F, S, E1 | E2, B>
  /** Alias for `apWithIndex` */
  readonly applyWithIndex: ApplicativeWithIndex<F, I>["apWithIndex"]
  readonly flapWithIndex: <S, E1, A, B>(
    fiab: Kind<F, S, E1, (a: A, i: I) => B>,
  ) => <E2>(self: Kind<F, S, E2, A>) => Kind<F, S, E1 | E2, B>
  /** Alias for `flapWithIndex` */
  readonly flipApplyWithIndex: ApplicativeWithIndex<F, I>["flapWithIndex"]
}

export const createApplicativeWithIndex = <F extends Hkt, I>(
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
