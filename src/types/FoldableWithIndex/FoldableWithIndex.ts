import { URIS, URIS2 } from "../Kind"
import { Foldable, Foldable2, Foldable2C } from "../Foldable"
import { ReduceWithIndex, ReduceWithIndex2 } from "./ReduceWithIndex"
import {
  ReduceRightWithIndex,
  ReduceRightWithIndex2,
} from "./ReduceRightWithIndex"
import { ReduceWithIndex2C } from "./ReduceWithIndex/ReduceWithIndex2C"
import { ReduceRightWithIndex2C } from "./ReduceRightWithIndex/ReduceRightWithIndex2C"

export interface FoldableWithIndex<URI extends URIS, I> extends Foldable<URI> {
  readonly reduceWithIndex: ReduceWithIndex<URI, I>
  readonly reduceRightWithIndex: ReduceRightWithIndex<URI, I>
}

export interface FoldableWithIndex2<URI extends URIS2, I>
  extends Foldable2<URI> {
  readonly reduceWithIndex: ReduceWithIndex2<URI, I>
  readonly reduceRightWithIndex: ReduceRightWithIndex2<URI, I>
}

export interface FoldableWithIndex2C<URI extends URIS2, I, E>
  extends Foldable2C<URI, E> {
  readonly reduceWithIndex: ReduceWithIndex2C<URI, I, E>
  readonly reduceRightWithIndex: ReduceRightWithIndex2C<URI, I, E>
}
