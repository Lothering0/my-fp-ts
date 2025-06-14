import { URIS, Kind } from "../../Kind"

export interface FilterWithIndex<URI extends URIS, I>
  extends FilterWithIndexPointed<URI, I>,
    FilterWithIndexPointFree<URI, I> {}

export interface FilterWithIndexPointed<URI extends URIS, I> {
  <A>(fa: Kind<URI, A>, p: (i: I, a: A) => boolean): Kind<URI, A>
}

export interface FilterWithIndexPointFree<URI extends URIS, I> {
  <A>(p: (i: I, a: A) => boolean): (fa: Kind<URI, A>) => Kind<URI, A>
}
