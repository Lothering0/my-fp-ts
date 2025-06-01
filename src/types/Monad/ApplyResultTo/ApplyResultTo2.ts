import { HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"
import { DoObject } from "../DoObject"

export interface ApplyResultTo2<URI extends URIS2>
  extends ApplyResultTo2Pointed<URI>,
    ApplyResultTo2PointFree<URI> {}

export interface ApplyResultTo2Pointed<URI extends URIS2> {
  <N extends string | number | symbol, _, A, B>(
    fa: HKT2<URI, _, A>,
    name: Exclude<N, keyof A>,
    fb: HKT2<URI, _, B>,
  ): HKT2<URI, _, DoObject<N, A, B>>
}

export interface ApplyResultTo2PointFree<URI extends URIS2> {
  <N extends string | number | symbol, _, A, B>(
    name: Exclude<N, keyof A>,
    fb: HKT2<URI, _, B>,
  ): (fa: HKT2<URI, _, A>) => HKT2<URI, _, DoObject<N, A, B>>
}
