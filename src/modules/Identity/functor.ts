import * as F from "../../types/Functor"
import { Identity, IdentityHKT } from "./identity"
import { overload } from "../../utils/overloads"

export const Functor: F.Functor<IdentityHKT> = {
  map: overload (1, (self, ab) => ab (self)),
}

export const map: {
  <A, B>(ab: (a: A) => B): (self: Identity<A>) => Identity<B>
  <A, B>(self: Identity<A>, ab: (a: A) => B): Identity<B>
} = Functor.map
