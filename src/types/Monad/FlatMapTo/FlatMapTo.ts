import { URIS, Kind } from "../../Kind"
import { DoObject } from "../DoObject"

export interface FlatMapTo<URI extends URIS>
  extends FlatMapToPointed<URI>,
    FlatMapToPointFree<URI> {}

export interface FlatMapToPointed<URI extends URIS> {
  <N extends string | number | symbol, A, B>(
    ma: Kind<URI, A>,
    name: Exclude<N, keyof A>,
    f: (a: A) => Kind<URI, B>,
  ): Kind<URI, DoObject<N, A, B>>
}

export interface FlatMapToPointFree<URI extends URIS> {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    f: (a: A) => Kind<URI, B>,
  ): (ma: Kind<URI, A>) => Kind<URI, DoObject<N, A, B>>
}
