import * as functor from "../../types/Functor"
import { Identity, IdentityHKT } from "./identity"

export const Functor: functor.Functor<IdentityHKT> = {
  map: ab => self => ab (self),
}

export const map: {
  <A, B>(ab: (a: A) => B): (self: Identity<A>) => Identity<B>
} = Functor.map
