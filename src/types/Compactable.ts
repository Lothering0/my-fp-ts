import { Option } from "src/modules/option"
import { HKT, HKT2 } from "./HKT"
import { URIS, URIS2 } from "./Kind"
import { Either } from "../modules/either"
import { Separated } from "src/modules/separated/separated"

export interface Compactable<URI extends URIS> {
  readonly _URI: URI
  readonly compact: <A>(fa: HKT<URI, Option<A>>) => HKT<URI, A>
  readonly separate: <E, A>(
    fa: HKT<URI, Either<E, A>>,
  ) => Separated<HKT<URI, E>, HKT<URI, A>>
}

export interface Compactable2<URI extends URIS2> {
  readonly _URI: URI
  readonly compact: <_, A>(fa: HKT2<URI, _, Option<A>>) => HKT2<URI, _, A>
  readonly separate: <E, A, B>(
    fa: HKT2<URI, E, Either<A, B>>,
  ) => Separated<HKT2<URI, E, A>, HKT2<URI, E, B>>
}
