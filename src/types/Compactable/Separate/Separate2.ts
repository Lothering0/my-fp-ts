import { HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"
import { Either } from "../../../modules/either"
import { Separated } from "../../../modules/separated"

export interface Separate2<URI extends URIS2> {
  <E, A, B>(
    fa: HKT2<URI, E, Either<A, B>>,
  ): Separated<HKT2<URI, E, A>, HKT2<URI, E, B>>
}
