import { _ } from "./underscore"
import { Applicative } from "../types/Applicative"
import { Predicate } from "../modules/Predicate"
import { LazyArg } from "../types/utils"
import { HKT, Kind } from "../types/HKT"

export const getDoWhile: {
  <F extends HKT>(
    applicative: Applicative<F>,
  ): <_, _2, A>(p: Predicate<void>) => (a: LazyArg<A>) => Kind<F, _, _2, void>
} = applicative => p => a => {
  while (p ()) a ()
  return applicative.of (_)
}
