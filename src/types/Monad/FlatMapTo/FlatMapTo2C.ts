import { HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"
import { DoObject } from "../DoObject"

export interface FlatMapTo2C<URI extends URIS2, E>
  extends FlatMapTo2CPointed<URI, E>,
    FlatMapTo2CPointFree<URI, E> {}

export interface FlatMapTo2CPointed<URI extends URIS2, _> {
  <N extends string | number | symbol, A, B>(
    ma: HKT2<URI, _, A>,
    name: Exclude<N, keyof A>,
    f: (a: A) => HKT2<URI, _, B>,
  ): HKT2<URI, _, DoObject<N, A, B>>
}

export interface FlatMapTo2CPointFree<URI extends URIS2, _> {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    f: (a: A) => HKT2<URI, _, B>,
  ): (ma: HKT2<URI, _, A>) => HKT2<URI, _, DoObject<N, A, B>>
}
