import { URIS, URIS2 } from "../Kind"
import { Reduce, Reduce2, Reduce2C } from "./Reduce"
import { ReduceRight, ReduceRight2, ReduceRight2C } from "./ReduceRight"

export interface Foldable<URI extends URIS> {
  readonly URI: URI
  readonly reduce: Reduce<URI>
  readonly reduceRight: ReduceRight<URI>
}

export interface Foldable2<URI extends URIS2> {
  readonly URI: URI
  readonly reduce: Reduce2<URI>
  readonly reduceRight: ReduceRight2<URI>
}

export interface Foldable2C<URI extends URIS2, E> {
  readonly URI: URI
  readonly _E: E
  readonly reduce: Reduce2C<URI, E>
  readonly reduceRight: ReduceRight2C<URI, E>
}
