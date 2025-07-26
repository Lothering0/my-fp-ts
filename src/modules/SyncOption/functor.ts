import * as O from "../Option"
import * as F from "../../types/Functor"
import { SyncOptionHKT, execute, SyncOption } from "./sync-option"
import { pipe } from "../../utils/flow"

export const Functor: F.Functor<SyncOptionHKT> = {
  map: ab => self => () => pipe (self, execute, O.map (ab)),
}

export const map: {
  <A, B>(ab: (a: A) => B): (self: SyncOption<A>) => SyncOption<B>
} = Functor.map
