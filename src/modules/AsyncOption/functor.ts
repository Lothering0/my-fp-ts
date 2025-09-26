import * as option from "../Option"
import * as functor from "../../typeclasses/Functor"
import { AsyncOptionHkt, AsyncOption, toPromise } from "./async-option"

export const Functor: functor.Functor<AsyncOptionHkt> = {
  map: ab => self => () => toPromise (self).then (option.map (ab)),
}

export const map: {
  <In, Out>(ab: (a: In) => Out): (self: AsyncOption<In>) => AsyncOption<Out>
} = Functor.map
