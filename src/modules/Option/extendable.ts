import { Extendable } from "../../types/Extendable"
import { Option, OptionHKT } from "./option"
import { functor, map } from "./functor"
import { overload } from "../../utils/overloads"

export const extendable: Extendable<OptionHKT> = {
  ...functor,
  extend: overload (
    1,
    <_, A, B>(self: Option<A>, fab: (fa: Option<A>) => B): Option<B> =>
      map (self, () => fab (self)),
  ),
}

export const { extend } = extendable
