import * as option from "../Option"
import { flow } from "../../utils/flow"
import { LazyArg } from "../../types/utils"
import { execute, SyncOption } from "./sync-option"

export const match: {
  <A, B>(onNone: LazyArg<B>, onSome: (a: A) => B): (self: SyncOption<A>) => B
} = (onNone, onSome) => flow (execute, option.match (onNone, onSome))
