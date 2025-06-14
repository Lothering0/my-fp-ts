import { URIS2, Kind2 } from "../../Kind"
import { DoObject } from "../DoObject"

export interface FlatMapTo2<URI extends URIS2>
  extends FlatMapTo2Pointed<URI>,
    FlatMapTo2PointFree<URI> {}

export interface FlatMapTo2Pointed<URI extends URIS2> {
  <N extends string | number | symbol, _, A, B>(
    ma: Kind2<URI, _, A>,
    name: Exclude<N, keyof A>,
    f: (a: A) => Kind2<URI, _, B>,
  ): Kind2<URI, _, DoObject<N, A, B>>
}

export interface FlatMapTo2PointFree<URI extends URIS2> {
  <N extends string | number | symbol, _, A, B>(
    name: Exclude<N, keyof A>,
    f: (a: A) => Kind2<URI, _, B>,
  ): (ma: Kind2<URI, _, A>) => Kind2<URI, _, DoObject<N, A, B>>
}
