import { overload } from "../../utils/overloads"
import { Extendable } from "../../types/Extendable"
import { Either, EitherHKT } from "./either"
import { functor, map } from "./functor"

export const extendable: Extendable<EitherHKT> = {
  ...functor,
  extend: overload (
    1,
    <_, A, B>(self: Either<_, A>, fab: (fa: Either<_, A>) => B): Either<_, B> =>
      map (self, () => fab (self)),
  ),
}

export const { extend } = extendable
