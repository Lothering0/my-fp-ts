import * as F from "../../types/Functor"
import { Identity, IdentityHKT } from "./identity"

export const Functor: F.Functor<IdentityHKT> = {
  map: ab => self => ab (self),
}

export const map: {
  <A, B>(ab: (a: A) => B): (self: Identity<A>) => Identity<B>
} = Functor.map
