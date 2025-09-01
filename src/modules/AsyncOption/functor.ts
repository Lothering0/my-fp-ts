import * as option from "../Option"
import * as functor from "../../typeclasses/Functor"
import { AsyncOptionHkt, AsyncOption, toPromise } from "./async-option"

export const Functor: functor.Functor<AsyncOptionHkt> = {
  map: ab => self => () => toPromise (self).then (option.map (ab)),
}

export const map: {
  <A, B>(ab: (a: A) => B): (self: AsyncOption<A>) => AsyncOption<B>
} = Functor.map
