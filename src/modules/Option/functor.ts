import * as F from "../../types/Functor"
import { OptionHKT, Option, some } from "./option"
import { pipe, flow } from "../../utils/flow"
import { match } from "./utils"
import { zero } from "./alternative"
import { overload } from "../../utils/overloads"

export const Functor: F.Functor<OptionHKT> = {
  map: overload (
    1,
    <_, A, B>(self: Option<A>, fab: (a: A) => B): Option<B> =>
      pipe (self, match (zero, flow (fab, some))),
  ),
}

export const map: {
  <A, B>(ab: (a: A) => B): (self: Option<A>) => Option<B>
  <A, B>(self: Option<A>, ab: (a: A) => B): Option<B>
} = Functor.map
