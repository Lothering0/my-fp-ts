import * as O from "../Option"
import * as F from "../../types/Functor"
import { AsyncOptionHKT, AsyncOption, toPromise } from "./async-option"
import { overload } from "../../utils/overloads"

export const Functor: F.Functor<AsyncOptionHKT> = {
  map: overload (
    1,
    <A, B>(self: AsyncOption<A>, ab: (a: A) => B): AsyncOption<B> =>
      () =>
        toPromise (self).then (O.map (ab)),
  ),
}

export const { map } = Functor
