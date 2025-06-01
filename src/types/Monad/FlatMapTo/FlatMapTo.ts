import { HKT } from "../../HKT"
import { URIS } from "../../Kind"
import { DoObject } from "../DoObject"

export interface FlatMapTo<URI extends URIS>
  extends FlatMapToPointed<URI>,
    FlatMapToPointFree<URI> {}

export interface FlatMapToPointed<URI extends URIS> {
  <N extends string | number | symbol, A, B>(
    ma: HKT<URI, A>,
    name: Exclude<N, keyof A>,
    f: (a: A) => HKT<URI, B>,
  ): HKT<URI, DoObject<N, A, B>>
}

export interface FlatMapToPointFree<URI extends URIS> {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    f: (a: A) => HKT<URI, B>,
  ): (ma: HKT<URI, A>) => HKT<URI, DoObject<N, A, B>>
}
