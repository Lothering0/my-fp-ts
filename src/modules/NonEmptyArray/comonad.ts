import * as C from "../../types/Comonad"
import { NonEmptyArray, NonEmptyArrayHKT } from "./non-empty-array"
import { head } from "./utils"
import { Extendable } from "./extendable"

export const Comonad: C.Comonad<NonEmptyArrayHKT> = {
  ...Extendable,
  extract: head,
}

export const extract: {
  <A>(self: NonEmptyArray<A>): A
} = Comonad.extract
