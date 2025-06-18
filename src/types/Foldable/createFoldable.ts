import { URIS, URIS2 } from "../Kind"
import { overload2 } from "../../utils/overloads"
import { Foldable, Foldable2 } from "./Foldable"
import { Reduce2Pointed, ReducePointed } from "./Reduce"
import { ReduceRight2Pointed, ReduceRightPointed } from "./ReduceRight"

type CreateFoldable = <URI extends URIS>(
  foldable: FoldablePointed<URI>,
) => Foldable<URI>
export const createFoldable: CreateFoldable = foldable => ({
  ...foldable,
  reduce: overload2 (foldable.reduce),
  reduceRight: overload2 (foldable.reduceRight),
})

type CreateFoldable2 = <URI extends URIS2>(
  foldable: FoldablePointed2<URI>,
) => Foldable2<URI>
export const createFoldable2: CreateFoldable2 =
  createFoldable as CreateFoldable2

interface FoldablePointed<URI extends URIS> {
  readonly URI: URI
  readonly reduce: ReducePointed<URI>
  readonly reduceRight: ReduceRightPointed<URI>
}

interface FoldablePointed2<URI extends URIS2> {
  readonly URI: URI
  readonly reduce: Reduce2Pointed<URI>
  readonly reduceRight: ReduceRight2Pointed<URI>
}
