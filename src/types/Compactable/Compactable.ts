import { URIS, URIS2 } from "../Kind"
import { Compact, Compact2, Compact2C } from "./Compact"
import {
  CompactEithers,
  CompactEithers2,
  CompactEithers2C,
} from "./CompactEithers"
import { Separate, Separate2, Separate2C } from "./Separate"

export interface Compactable<URI extends URIS> {
  readonly URI: URI
  readonly compact: Compact<URI>
  readonly compactEithers: CompactEithers<URI>
  readonly separate: Separate<URI>
}

export interface Compactable2<URI extends URIS2> {
  readonly URI: URI
  readonly compact: Compact2<URI>
  readonly compactEithers: CompactEithers2<URI>
  readonly separate: Separate2<URI>
}

export interface Compactable2C<URI extends URIS2, E> {
  readonly URI: URI
  readonly _E: E
  readonly compact: Compact2C<URI, E>
  readonly compactEithers: CompactEithers2C<URI, E>
  readonly separate: Separate2C<URI, E>
}
