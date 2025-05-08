import { overloadWithPointFree2 } from "src/utils/points"
import { HKT, HKT2 } from "./HKT"
import { URIS, URIS2 } from "./Kind"

export interface Foldable<URI extends URIS> {
  readonly _URI: URI
  readonly reduce: Reduce<URI>
  readonly reduceRight: ReduceRight<URI>
}

export interface Foldable2<URI extends URIS2> {
  readonly _URI: URI
  readonly reduce: Reduce2<URI>
  readonly reduceRight: ReduceRight2<URI>
}

type CreateFoldable = <URI extends URIS>(
  foldable: FoldablePointed<URI>,
) => Foldable<URI>
export const createFoldable: CreateFoldable = foldable => ({
  ...foldable,
  reduce: overloadWithPointFree2 (foldable.reduce),
  reduceRight: overloadWithPointFree2 (foldable.reduceRight),
})

type CreateFoldable2 = <URI extends URIS2>(
  foldable: FoldablePointed2<URI>,
) => Foldable2<URI>
export const createFoldable2: CreateFoldable2 =
  createFoldable as CreateFoldable2

interface FoldablePointed<URI extends URIS> {
  readonly _URI: URI
  readonly reduce: ReducePointed<URI>
  readonly reduceRight: ReduceRightPointed<URI>
}

interface FoldablePointed2<URI extends URIS2> {
  readonly _URI: URI
  readonly reduce: ReducePointed2<URI>
  readonly reduceRight: ReduceRightPointed2<URI>
}

interface ReducePointed<URI extends URIS> {
  <A, B>(fa: HKT<URI, A>, b: B, f: (b: B, a: A) => B): B
}

interface ReducePointed2<URI extends URIS2> {
  <E, A, B>(fa: HKT2<URI, E, A>, b: B, f: (b: B, a: A) => B): B
}

interface Reduce<URI extends URIS> extends ReducePointed<URI> {
  <A, B>(b: B, f: (b: B, a: A) => B): (fa: HKT<URI, A>) => B
}

interface Reduce2<URI extends URIS2> extends ReducePointed2<URI> {
  <E, A, B>(b: B, f: (b: B, a: A) => B): (fa: HKT2<URI, E, A>) => B
}

interface ReduceRightPointed<URI extends URIS> {
  <A, B>(fa: HKT<URI, A>, b: B, f: (a: A, b: B) => B): B
}

interface ReduceRightPointed2<URI extends URIS2> {
  <E, A, B>(fa: HKT2<URI, E, A>, b: B, f: (a: A, b: B) => B): B
}

interface ReduceRight<URI extends URIS> extends ReduceRightPointed<URI> {
  <A, B>(b: B, f: (a: A, b: B) => B): (fa: HKT<URI, A>) => B
}

interface ReduceRight2<URI extends URIS2> extends ReduceRightPointed2<URI> {
  <E, A, B>(b: B, f: (a: A, b: B) => B): (fa: HKT2<URI, E, A>) => B
}
