import { HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"
import { DoObject } from "../DoObject"

export interface ApplyResultTo2C<URI extends URIS2, E>
  extends ApplyResultTo2CPointed<URI, E>,
    ApplyResultTo2CPointFree<URI, E> {}

export interface ApplyResultTo2CPointed<URI extends URIS2, _> {
  <N extends string | number | symbol, A, B>(
    fa: HKT2<URI, _, A>,
    name: Exclude<N, keyof A>,
    fb: HKT2<URI, _, B>,
  ): HKT2<URI, _, DoObject<N, A, B>>
}

export interface ApplyResultTo2CPointFree<URI extends URIS2, _> {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    fb: HKT2<URI, _, B>,
  ): (fa: HKT2<URI, _, A>) => HKT2<URI, _, DoObject<N, A, B>>
}
