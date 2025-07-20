import * as O from "../Option"
import { pipe } from "../../utils/flow"
import { overload } from "../../utils/overloads"
import { LazyArg } from "../../types/utils"
import { execute, SyncOption } from "./sync-option"

export const match: {
  <A, B>(onNone: LazyArg<B>, onSome: (a: A) => B): (self: SyncOption<A>) => B
  <A, B>(self: SyncOption<A>, onNone: LazyArg<B>, onSome: (a: A) => B): B
} = overload (2, (fa, onNone, onSome) =>
  pipe (fa, execute, O.match (onNone, onSome)),
)
