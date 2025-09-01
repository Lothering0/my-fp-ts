import { _ } from "./underscore"
import { Applicative } from "../typeclasses/Applicative"
import { Predicate } from "../modules/Predicate"
import { LazyArg } from "../types/utils"
import { Hkt, Kind } from "../typeclasses/Hkt"

export const getDoWhile: {
  <F extends Hkt>(
    Applicative: Applicative<F>,
  ): <In, Collectable, Fixed>(
    p: Predicate<void>,
  ) => (a: LazyArg<In>) => Kind<F, void, Collectable, Fixed>
} = Applicative => p => a => {
  while (p ()) a ()
  return Applicative.of (_)
}
