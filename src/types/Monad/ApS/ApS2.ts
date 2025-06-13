import { HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"
import { DoObject } from "../DoObject"

export interface ApS2<URI extends URIS2>
  extends ApS2Pointed<URI>,
    ApS2PointFree<URI> {}

export interface ApS2Pointed<URI extends URIS2> {
  <N extends string | number | symbol, _, A, B>(
    fa: HKT2<URI, _, A>,
    name: Exclude<N, keyof A>,
    fb: HKT2<URI, _, B>,
  ): HKT2<URI, _, DoObject<N, A, B>>
}

export interface ApS2PointFree<URI extends URIS2> {
  <N extends string | number | symbol, _, A, B>(
    name: Exclude<N, keyof A>,
    fb: HKT2<URI, _, B>,
  ): (fa: HKT2<URI, _, A>) => HKT2<URI, _, DoObject<N, A, B>>
}
