import * as O from "../Option"
import * as F from "../../types/Functor"
import { AsyncOptionHKT, AsyncOption, toPromise } from "./async-option"

export const Functor: F.Functor<AsyncOptionHKT> = {
  map: ab => self => () => toPromise (self).then (O.map (ab)),
}

export const map: {
  <A, B>(ab: (a: A) => B): (self: AsyncOption<A>) => AsyncOption<B>
} = Functor.map
