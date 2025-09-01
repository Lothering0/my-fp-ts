import { Foldable } from "./Foldable"
import { Hkt, Kind } from "./Hkt"

export interface FoldableWithIndex<F extends Hkt, Index> extends Foldable<F> {
  readonly reduceWithIndex: <In, Out>(
    b: Out,
    baib: (b: Out, a: In, i: Index) => Out,
  ) => <Collectable, Fixed>(self: Kind<F, In, Collectable, Fixed>) => Out

  readonly reduceRightWithIndex: <In, Out>(
    b: Out,
    abib: (a: In, b: Out, i: Index) => Out,
  ) => <Collectable, Fixed>(self: Kind<F, In, Collectable, Fixed>) => Out
}
