import { HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"
import { Either } from "../../../modules/Either"
import { Separated } from "../../../modules/Separated"

export interface Separate2C<URI extends URIS2, E> {
  <A, B>(
    fa: HKT2<URI, E, Either<A, B>>,
  ): Separated<HKT2<URI, E, A>, HKT2<URI, E, B>>
}
