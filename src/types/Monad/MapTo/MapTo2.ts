import { HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"
import { DoObject } from "../DoObject"

export interface MapTo2<URI extends URIS2>
  extends MapTo2Pointed<URI>,
    MapTo2PointFree<URI> {}

export interface MapTo2Pointed<URI extends URIS2> {
  <N extends string | number | symbol, _, A, B>(
    fa: HKT2<URI, _, A>,
    name: Exclude<N, keyof A>,
    f: (a: A) => B,
  ): HKT2<URI, _, DoObject<N, A, B>>
}

export interface MapTo2PointFree<URI extends URIS2> {
  <N extends string | number | symbol, _, A, B>(
    name: Exclude<N, keyof A>,
    f: (a: A) => B,
  ): (fa: HKT2<URI, _, A>) => HKT2<URI, _, DoObject<N, A, B>>
}
