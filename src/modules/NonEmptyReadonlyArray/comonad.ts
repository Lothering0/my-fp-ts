import * as comonad from "../../types/Comonad"
import {
  NonEmptyReadonlyArray,
  NonEmptyReadonlyArrayHKT,
} from "./non-empty-readonly-array"
import { head } from "./utils"
import { Extendable } from "./extendable"

export const Comonad: comonad.Comonad<NonEmptyReadonlyArrayHKT> = {
  ...Extendable,
  extract: head,
}

export const extract: {
  <A>(self: NonEmptyReadonlyArray<A>): A
} = Comonad.extract
