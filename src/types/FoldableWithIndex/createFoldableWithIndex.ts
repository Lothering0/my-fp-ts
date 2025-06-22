import { URIS, URIS2 } from "../Kind"
import { Foldable, Foldable2 } from "../Foldable"
import { overload } from "../../utils/overloads"
import { FoldableWithIndex, FoldableWithIndex2 } from "./FoldableWithIndex"
import {
  ReduceWithIndex2Pointed,
  ReduceWithIndexPointed,
} from "./ReduceWithIndex"
import {
  ReduceRightWithIndex2Pointed,
  ReduceRightWithIndexPointed,
} from "./ReduceRightWithIndex"

type CreateFoldableWithIndex = <URI extends URIS, I>(
  foldable: CreateFoldableWithIndexArg<URI, I>,
) => FoldableWithIndex<URI, I>
export const createFoldableWithIndex: CreateFoldableWithIndex = foldable => ({
  ...foldable,
  reduceWithIndex: overload (2, foldable.reduceWithIndex),
  reduceRightWithIndex: overload (2, foldable.reduceRightWithIndex),
})

type CreateFoldableWithIndex2 = <URI extends URIS2, I>(
  foldable: CreateFoldableWithIndexArg2<URI, I>,
) => FoldableWithIndex2<URI, I>
export const createFoldableWithIndex2: CreateFoldableWithIndex2 =
  createFoldableWithIndex as CreateFoldableWithIndex2

interface CreateFoldableWithIndexArg<URI extends URIS, I>
  extends Foldable<URI> {
  readonly reduceWithIndex: ReduceWithIndexPointed<URI, I>
  readonly reduceRightWithIndex: ReduceRightWithIndexPointed<URI, I>
}

interface CreateFoldableWithIndexArg2<URI extends URIS2, I>
  extends Foldable2<URI> {
  readonly reduceWithIndex: ReduceWithIndex2Pointed<URI, I>
  readonly reduceRightWithIndex: ReduceRightWithIndex2Pointed<URI, I>
}
