import * as O from "../Option"
import { pipe } from "../../utils/flow"
import { LazyArg } from "../../types/utils"
import { execute, SyncOption } from "./sync-option"

export const match: {
  <A, B>(onNone: LazyArg<B>, onSome: (a: A) => B): (self: SyncOption<A>) => B
} = (onNone, onSome) => self => pipe (self, execute, O.match (onNone, onSome))
