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

export const create = <F extends Hkt, Index>(
  FunctorWithIndex: FunctorWithIndex<F, Index>,
  Applicative: Applicative<F>,
  ApplicativeWithIndex: Pick<ApplicativeWithIndex<F, Index>, "apWithIndex">,
): ApplicativeWithIndex<F, Index> => {
  const flapWithIndex: ApplicativeWithIndex<F, Index>["flapWithIndex"] = flip (
    ApplicativeWithIndex.apWithIndex,
  ) as typeof flapWithIndex

  return {
    ...FunctorWithIndex,
    ...Applicative,
    ...ApplicativeWithIndex,
    applyWithIndex: ApplicativeWithIndex.apWithIndex,
    flapWithIndex,
    flipApplyWithIndex: flapWithIndex,
  }
}
