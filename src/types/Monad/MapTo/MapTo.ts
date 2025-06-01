import { HKT } from "../../HKT"
import { URIS } from "../../Kind"
import { DoObject } from "../DoObject"

export interface MapTo<URI extends URIS>
  extends MapToPointed<URI>,
    MapToPointFree<URI> {}

export interface MapToPointed<URI extends URIS> {
  <N extends string | number | symbol, A, B>(
    fa: HKT<URI, A>,
    name: Exclude<N, keyof A>,
    f: (a: A) => B,
  ): HKT<URI, DoObject<N, A, B>>
}

export interface MapToPointFree<URI extends URIS> {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    f: (a: A) => B,
  ): (fa: HKT<URI, A>) => HKT<URI, DoObject<N, A, B>>
}
