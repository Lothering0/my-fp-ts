import { Hkt, Kind } from "./Hkt"
import { Applicative } from "./Applicative"
import { FunctorWithIndex } from "./FunctorWithIndex"
import { flip } from "../utils/flip"

export interface ApplicativeWithIndex<F extends Hkt, Index>
  extends FunctorWithIndex<F, Index>,
    Applicative<F> {
  readonly apWithIndex: <In, Collectable1, Fixed>(
    fa: Kind<F, In, Collectable1, Fixed>,
  ) => <Out, Collectable2>(
    self: Kind<F, (a: In, i: Index) => Out, Collectable2, Fixed>,
  ) => Kind<F, Out, Collectable1 | Collectable2, Fixed>
  /** Alias for `apWithIndex` */
  readonly applyWithIndex: ApplicativeWithIndex<F, Index>["apWithIndex"]
  readonly flapWithIndex: <In, Out, Collectable1, Fixed>(
    fiab: Kind<F, (a: In, i: Index) => Out, Collectable1, Fixed>,
  ) => <Collectable2>(
    self: Kind<F, In, Collectable2, Fixed>,
  ) => Kind<F, Out, Collectable1 | Collectable2, Fixed>
  /** Alias for `flapWithIndex` */
  readonly flipApplyWithIndex: ApplicativeWithIndex<F, Index>["flapWithIndex"]
}

export const createApplicativeWithIndex = <F extends Hkt, Index>(
  Applicative: Applicative<F> &
    FunctorWithIndex<F, Index> &
    Pick<ApplicativeWithIndex<F, Index>, "apWithIndex">,
): ApplicativeWithIndex<F, Index> => {
  const flapWithIndex: ApplicativeWithIndex<F, Index>["flapWithIndex"] = flip (
    Applicative.apWithIndex,
  ) as typeof flapWithIndex

  return {
    ...Applicative,
    applyWithIndex: Applicative.apWithIndex,
    flapWithIndex,
    flipApplyWithIndex: flapWithIndex,
  }
}
