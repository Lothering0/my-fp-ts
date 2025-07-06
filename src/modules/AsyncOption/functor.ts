import * as O from "../Option"
import { Functor } from "../../types/Functor"
import { AsyncOptionHKT, AsyncOption, fromAsyncOption } from "./async-option"
import { overload } from "../../utils/overloads"

export const functor: Functor<AsyncOptionHKT> = {
  map: overload (
    1,
    <A, B>(self: AsyncOption<A>, ab: (a: A) => B): AsyncOption<B> =>
      () =>
        fromAsyncOption (self).then (O.map (ab)),
  ),
}

export const { map } = functor
