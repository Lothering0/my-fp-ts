import * as O from "../Option"
import * as F from "../../types/Functor"
import { SyncOptionHKT, execute, SyncOption } from "./sync-option"
import { pipe } from "../../utils/flow"
import { overload } from "../../utils/overloads"

export const Functor: F.Functor<SyncOptionHKT> = {
  map: overload (
    1,
    <A, B>(self: SyncOption<A>, ab: (a: A) => B): SyncOption<B> =>
      () =>
        pipe (self, execute, O.map (ab)),
  ),
}

export const { map } = Functor
