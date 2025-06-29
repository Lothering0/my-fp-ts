import * as O from "../Option"
import { Functor } from "../../types/Functor"
import { IoOptionHKT, fromIoOption, IoOption } from "./io-option"
import { pipe } from "../../utils/flow"
import { overload } from "../../utils/overloads"

export const functor: Functor<IoOptionHKT> = {
  map: overload (
    1,
    <A, B>(self: IoOption<A>, ab: (a: A) => B): IoOption<B> =>
      () =>
        pipe (self, fromIoOption, O.map (ab)),
  ),
}

export const { map } = functor
