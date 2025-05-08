import { overloadWithPointFree2 } from "src/utils/points"
import { HKT, HKT2 } from "./HKT"
import { URIS, URIS2 } from "./Kind"
import { Foldable, Foldable2 } from "./Foldable"

export interface FoldableWithIndex<URI extends URIS, I> extends Foldable<URI> {
  readonly reduceWithIndex: ReduceWithIndex<URI, I>
  readonly reduceRightWithIndex: ReduceRightWithIndex<URI, I>
}

export interface FoldableWithIndex2<URI extends URIS2, I>
  extends Foldable2<URI> {
  readonly reduceWithIndex: ReduceWithIndex2<URI, I>
  readonly reduceRightWithIndex: ReduceRightWithIndex2<URI, I>
}

type CreateFoldableWithIndex = <URI extends URIS, I>(
  foldable: CreateFoldableWithIndexArg<URI, I>,
) => FoldableWithIndex<URI, I>
export const createFoldableWithIndex: CreateFoldableWithIndex = foldable => ({
  ...foldable,
  reduceWithIndex: overloadWithPointFree2 (foldable.reduceWithIndex),
  reduceRightWithIndex: overloadWithPointFree2 (foldable.reduceRightWithIndex),
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
  readonly reduceWithIndex: ReduceWithIndexPointed2<URI, I>
  readonly reduceRightWithIndex: ReduceRightWithIndexPointed2<URI, I>
}

interface ReduceWithIndexPointed<URI extends URIS, I> {
  <A, B>(fa: HKT<URI, A>, b: B, f: (i: I, b: B, a: A) => B): B
}

interface ReduceWithIndexPointed2<URI extends URIS2, I> {
  <E, A, B>(fa: HKT2<URI, E, A>, b: B, f: (i: I, b: B, a: A) => B): B
}

interface ReduceWithIndex<URI extends URIS, I>
  extends ReduceWithIndexPointed<URI, I> {
  <A, B>(b: B, f: (i: I, b: B, a: A) => B): (fa: HKT<URI, A>) => B
}

interface ReduceWithIndex2<URI extends URIS2, I>
  extends ReduceWithIndexPointed2<URI, I> {
  <E, A, B>(b: B, f: (i: I, b: B, a: A) => B): (fa: HKT2<URI, E, A>) => B
}

interface ReduceRightWithIndexPointed<URI extends URIS, I> {
  <A, B>(fa: HKT<URI, A>, b: B, f: (i: I, b: B, a: A) => B): B
}

interface ReduceRightWithIndexPointed2<URI extends URIS2, I> {
  <E, A, B>(fa: HKT2<URI, E, A>, b: B, f: (i: I, b: B, a: A) => B): B
}

interface ReduceRightWithIndex<URI extends URIS, I>
  extends ReduceRightWithIndexPointed<URI, I> {
  <A, B>(b: B, f: (i: I, a: A, b: B) => B): (fa: HKT<URI, A>) => B
}

interface ReduceRightWithIndex2<URI extends URIS2, I>
  extends ReduceRightWithIndexPointed2<URI, I> {
  <E, A, B>(b: B, f: (i: I, a: A, b: B) => B): (fa: HKT2<URI, E, A>) => B
}
