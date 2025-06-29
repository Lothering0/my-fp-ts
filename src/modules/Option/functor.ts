import { Functor } from "../../types/Functor"
import { OptionHKT, Option, some } from "./option"
import { pipe, flow } from "../../utils/flow"
import { match, zero } from "./utils"
import { overload } from "../../utils/overloads"

export const functor: Functor<OptionHKT> = {
  map: overload (
    1,
    <_, A, B>(self: Option<A>, fab: (a: A) => B): Option<B> =>
      pipe (self, match (zero, flow (fab, some))),
  ),
}

export const { map } = functor
